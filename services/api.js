import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const useApi = () => {
    const navigate = useNavigate();
    const { clearAuth } = useContext(AuthContext);

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
        (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && error.response.status === 401) {
                clearAuth();
                navigate('/auth');
                return Promise.reject(error);
            }
           console.error('Response error:', error);
           return Promise.reject(error);
        }
    );

    const makeRequest = async (config) => {
        try {
            const response = await api(config);
            return response.data;
        } catch (error) {
             console.error('API request failed:', error);
            throw error;
        }
    };
    

  return { makeRequest };
};



export default useApi;
