import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { AuthProvider } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';
import authService from '../services/auth';
import { sanitizeInput } from '../utils/helpers';

jest.mock('../services/auth');
jest.mock('../utils/helpers', () => ({
    sanitizeInput: jest.fn(input => input),
}));


describe('Button Component', () => {
    it('should render button with provided text', () => {
        render(<Button onClick={() => {}}>Click Me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click Me');
    });

    it('should trigger onClick callback when clicked', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click Me</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled and not clickable when disabled prop is true', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick} disabled>Click Me</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button')).toHaveClass('disabled:bg-gray-400');
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('should have correct role and aria-disabled attributes', () => {
         render(<Button onClick={() => {}} disabled={true}>Click Me</Button>);
         const button = screen.getByRole('button');
         expect(button).toHaveAttribute('role', 'button');
         expect(button).toHaveAttribute('aria-disabled', 'true');
    });
});

describe('Input Component', () => {
    it('should render input with provided placeholder and type', () => {
        render(<Input type="email" placeholder="Email" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Email');
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });


    it('should trigger onChange callback when input value changes and sanitize input', () => {
        const onChange = jest.fn();
         render(<Input type="text" placeholder="Name" onChange={onChange} name="name" />);
        const inputElement = screen.getByRole('textbox');
        fireEvent.change(inputElement, { target: { value: '<script>alert("test")</script>' } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: '<script>alert("test")</script>' })}));
        expect(sanitizeInput).toHaveBeenCalledTimes(1);
    });

    it('should have correct aria-label', () => {
      render(<Input type="text" placeholder="Name" onChange={() => {}} />);
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Name');
    });

     it('should render label element when name is provided', () => {
       render(<Input type="text" placeholder="Name" onChange={() => {}} name="name" />);
         const labelElement = screen.getByLabelText('Name');
        expect(labelElement).toBeInTheDocument();
        expect(labelElement).toHaveAttribute('for', 'input-name');
    });
});

describe('LoginForm Component', () => {
    const mockLogin = jest.fn();

      beforeEach(() => {
           jest.clearAllMocks();
          authService.mockReturnValue({
                login: mockLogin,
              });
          jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
            jest.spyOn(localStorage, 'setItem').mockReturnValue();
            jest.spyOn(localStorage, 'removeItem').mockReturnValue();
        });


    it('should render email and password inputs and submit button', () => {
      render(
           <AuthProvider>
               <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
             </AuthProvider>
        );
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    });

   it('should handle input changes', () => {
          render(
            <AuthProvider>
                 <MemoryRouter>
                    <LoginForm />
                 </MemoryRouter>
            </AuthProvider>
          );
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        expect(screen.getByPlaceholderText('Email')).toHaveValue('test@example.com');
        expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
    });

    it('should display error message for invalid email', async () => {
           render(
            <AuthProvider>
                 <MemoryRouter>
                    <LoginForm />
                 </MemoryRouter>
            </AuthProvider>
          );
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
          await waitFor(() => {
               expect(screen.getByText('Invalid email format')).toBeInTheDocument();
          });
    });

       it('should display error message if required fields are missing', async () => {
           render(
             <AuthProvider>
                 <MemoryRouter>
                   <LoginForm />
                  </MemoryRouter>
            </AuthProvider>
           );

         fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
            await waitFor(() => {
                expect(screen.getByText('Email is required')).toBeInTheDocument();
                expect(screen.getByText('Password is required')).toBeInTheDocument();
           });
        });


    it('should navigate to /dashboard on successful login', async () => {
        mockLogin.mockResolvedValue({ token: 'mocked-token' });
          const mockUseAuth = jest.fn().mockReturnValue({
              login: jest.fn(),
            });
         jest.mock('../hooks/useAuth', () => mockUseAuth);

       render(
         <AuthProvider>
           <MemoryRouter>
            <LoginForm />
           </MemoryRouter>
         </AuthProvider>
        );
          fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
          fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
          fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

          await waitFor(() => {
              expect(mockUseAuth().login).toHaveBeenCalledWith('mocked-token');
            });
    });

    it('should display error message on login failure', async () => {
        mockLogin.mockRejectedValue(new Error('Invalid credentials'));
          render(
            <AuthProvider>
                 <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
            </AuthProvider>
          );

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

          await waitFor(() => {
              expect(screen.getByText('Login failed: Invalid credentials')).toBeInTheDocument();
          });
    });

    it('should display loading message during form submission', async () => {
        mockLogin.mockResolvedValue({ token: 'mocked-token' });

          render(
              <AuthProvider>
                 <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
              </AuthProvider>
          );
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

        expect(screen.getByRole('button', { name: 'Logging in...' })).toBeInTheDocument();
         await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'Logging in...' })).not.toBeInTheDocument();
        });
    });

      it('should display a general error message on api failure without message', async () => {
             mockLogin.mockRejectedValue(new Error());
            render(
                <AuthProvider>
                     <MemoryRouter>
                        <LoginForm />
                    </MemoryRouter>
                </AuthProvider>
            );

          fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
          fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
          fireEvent.click(screen.getByRole('button', { name: 'Log In' }));

            await waitFor(() => {
                expect(screen.getByText('Login failed: Internal server error')).toBeInTheDocument();
            });
      });
});

describe('SignupForm Component', () => {
      const mockSignup = jest.fn();
      beforeEach(() => {
             jest.clearAllMocks();
            authService.mockReturnValue({
                  signup: mockSignup,
                });
          jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
          jest.spyOn(localStorage, 'setItem').mockReturnValue();
          jest.spyOn(localStorage, 'removeItem').mockReturnValue();
      });


    it('should render username, email and password inputs and submit button', () => {
         render(
             <AuthProvider>
                  <MemoryRouter>
                    <SignupForm />
                   </MemoryRouter>
             </AuthProvider>
          );
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });


   it('should handle input changes', () => {
        render(
            <AuthProvider>
                <MemoryRouter>
                    <SignupForm />
                </MemoryRouter>
            </AuthProvider>
        );
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
          expect(screen.getByPlaceholderText('Username')).toHaveValue('testuser');
          expect(screen.getByPlaceholderText('Email')).toHaveValue('test@example.com');
          expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
    });

     it('should display error message for invalid email', async () => {
       render(
            <AuthProvider>
                 <MemoryRouter>
                   <SignupForm />
               </MemoryRouter>
            </AuthProvider>
        );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        });
    });


      it('should display error message if required fields are missing', async () => {
            render(
              <AuthProvider>
                  <MemoryRouter>
                      <SignupForm />
                   </MemoryRouter>
              </AuthProvider>
            );
          fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
             await waitFor(() => {
                expect(screen.getByText('Username is required')).toBeInTheDocument();
                expect(screen.getByText('Email is required')).toBeInTheDocument();
                 expect(screen.getByText('Password is required')).toBeInTheDocument();
           });
      });


    it('should navigate to /dashboard on successful signup', async () => {
      mockSignup.mockResolvedValue({ token: 'mocked-token' });
           const mockUseAuth = jest.fn().mockReturnValue({
                 login: jest.fn(),
             });
          jest.mock('../hooks/useAuth', () => mockUseAuth);

          render(
              <AuthProvider>
                  <MemoryRouter>
                      <SignupForm />
                  </MemoryRouter>
             </AuthProvider>
          );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
       fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

         await waitFor(() => {
             expect(mockUseAuth().login).toHaveBeenCalledWith('mocked-token');
           });
    });

    it('should display error message on signup failure', async () => {
        mockSignup.mockRejectedValue(new Error('Signup failed: User already exists'));
           render(
                <AuthProvider>
                   <MemoryRouter>
                      <SignupForm />
                  </MemoryRouter>
             </AuthProvider>
            );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
       fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
       fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

        await waitFor(() => {
           expect(screen.getByText('Signup failed: User already exists')).toBeInTheDocument();
        });
    });


     it('should display loading message during form submission', async () => {
        mockSignup.mockResolvedValue({ token: 'mocked-token' });
           render(
                <AuthProvider>
                   <MemoryRouter>
                     <SignupForm />
                  </MemoryRouter>
             </AuthProvider>
           );

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
       fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
       fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
        expect(screen.getByRole('button', { name: 'Signing up...' })).toBeInTheDocument();

         await waitFor(() => {
              expect(screen.queryByRole('button', { name: 'Signing up...' })).not.toBeInTheDocument();
          });
    });


      it('should display a general error message on api failure without message', async () => {
          mockSignup.mockRejectedValue(new Error());
           render(
               <AuthProvider>
                    <MemoryRouter>
                      <SignupForm />
                   </MemoryRouter>
              </AuthProvider>
           );
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
       fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
       fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
         await waitFor(() => {
            expect(screen.getByText('Signup failed: Internal server error')).toBeInTheDocument();
          });
      });
});
