import React from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import useForm from '../hooks/useForm';
import authService from '../services/auth';
import useAuth from '../hooks/useAuth';
import PropTypes from 'prop-types';

/**
 * SignupForm Component.
 * Renders a signup form with username, email, and password input fields and a submit button.
 * Handles form state, input changes, validation, and submission using useForm hook.
 * Makes a signup request to the /api/auth/signup endpoint using services/auth.js.
 * Updates the authentication state upon successful signup using useAuth hook.
 * Displays error messages to the user upon signup failure.
 *
 * @returns {JSX.Element} The SignupForm component.
 */
const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { signup: authSignup } = authService();


  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    loading,
  } = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = 'Username is required';
      }
       if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
        errors.email = 'Invalid email format';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const response = await authSignup(values.username, values.email, values.password);
        if (response && response.token) {
          login(response.token);
          navigate('/dashboard');
        }
      } catch (error) {
          if (error.message) {
              setErrors((prevErrors) => ({ ...prevErrors, form: error.message }));
          } else {
               setErrors((prevErrors) => ({ ...prevErrors, form: 'Signup failed: Internal server error' }));
            }
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {errors.form && <div className="text-red-500 text-sm mb-4">{errors.form}</div>}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={handleChange}
        />
          {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
      </div>
      <div className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
      </div>
      <div className="mb-6">
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  );
};

SignupForm.propTypes = {
    
};


export default SignupForm;
