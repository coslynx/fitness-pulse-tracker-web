import axios from 'axios';
import useApi from '../services/api.js';

const authService = () => {
    const { makeRequest } = useApi();
    
    const login = async (email, password) => {
        try {
            const response = await makeRequest({
              url: '/api/auth/login',
              method: 'POST',
              data: {
                email: email.trim(),
                password
              },
              headers: {
                  'Content-Type': 'application/json',
              }
          });
            return response;
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            console.error('Login failed:', error.response.data.message);
            throw new Error(error.response.data.message);
          } else{
            console.error('Login failed:', error);
             throw new Error('Login failed: Internal server error');
          }
        }
    };
    
    const signup = async (username, email, password) => {
         try {
             const response = await makeRequest({
                url: '/api/auth/signup',
                method: 'POST',
                data: {
                   username: username.trim(),
                   email: email.trim(),
                   password
                },
                 headers: {
                    'Content-Type': 'application/json',
                }
           });
           return response;
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            console.error('Signup failed:', error.response.data.message);
            throw new Error(error.response.data.message);
           } else {
                console.error('Signup failed:', error);
                 throw new Error('Signup failed: Internal server error');
            }
        }
    };
    
    const logout = () => {
         localStorage.removeItem('token');
    };

    return {
        login,
        signup,
        logout
    };
};

export default authService;
