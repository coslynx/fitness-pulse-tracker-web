import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/auth';
import { jwtDecode } from 'jwt-decode';

/**
 * Custom React hook for managing user authentication state and actions.
 * @returns {{
 *   user: { userId: string, username: string } | null,
 *   token: string | null,
 *   login: (newToken: string) => void,
 *   logout: () => void
 * }} An object containing the user, token, login function, and logout function.
 */
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const { login: contextLogin, logout: contextLogout, clearAuth: contextClearAuth } = useContext(AuthContext);
    const { login: authLogin, logout: authLogout } = authService();

    /**
     * useEffect hook to run on component mount, retrieves token from localStorage, verifies it, and sets the user state.
     */
    useEffect(() => {
        try {
             const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                     const decoded = jwtDecode(storedToken);
                    if (decoded && decoded.userId && decoded.username) {
                        setUser({ userId: decoded.userId, username: decoded.username });
                        setToken(storedToken);
                    } else {
                         localStorage.removeItem('token');
                        setUser(null);
                        setToken(null);
                    }
                 } catch (error) {
                     console.error('Error decoding token during initial load:', error);
                     localStorage.removeItem('token');
                     setUser(null);
                     setToken(null);
                }
            }
        } catch (error) {
            console.error('Error accessing localStorage during initial load:', error);
             localStorage.removeItem('token');
            setUser(null);
            setToken(null);
        }

    }, []);

    /**
     * Function to log in the user. It saves the token to localStorage, decodes it, updates the user state, and sets the token.
     * @param {string} newToken - The new JWT token.
     */
    const login = (newToken) => {
        try {
            localStorage.setItem('token', newToken);
            const decoded = jwtDecode(newToken);
             if(decoded && decoded.userId && decoded.username) {
                 setUser({ userId: decoded.userId, username: decoded.username });
                setToken(newToken);
                contextLogin(newToken);
            } else{
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
                contextClearAuth();
            }
        } catch (error) {
             console.error('Error during login token decoding:', error);
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
            contextClearAuth();
        }
    };

     /**
     * Function to log out the user by removing the token from localStorage and resetting user state.
     */
    const logout = () => {
      try {
          localStorage.removeItem('token');
          setUser(null);
          setToken(null);
          contextLogout();
        } catch (error) {
            console.error('Error during logout:', error);
            setUser(null);
            setToken(null);
            contextClearAuth();
        }
    };


    return {
        user,
        token,
        login,
        logout,
    };
};

export default useAuth;
