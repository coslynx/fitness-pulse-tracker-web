import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useAuth from '../hooks/useAuth';
import PropTypes from 'prop-types';

/**
 * Header Component.
 * Renders the application header, providing navigation and user authentication status display.
 * @returns {JSX.Element} The Header component.
 */
const Header = () => {
    const { user } = useContext(AuthContext);
    const { logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles the logout action.
     * Clears the user session and redirects to the home page.
     */
    const handleLogout = () => {
        try {
           logout();
           navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
             navigate('/');
        }
    };


    return (
        <header className="bg-gray-800 text-white fixed top-0 w-full z-50" role="banner" aria-label="Main Navigation">
            <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                    <NavLink to="/" className="hover:text-gray-300 py-2 px-3 rounded" aria-label="Navigate to home page">
                        Home
                    </NavLink>
                    {user && (
                         <NavLink to="/dashboard" className="hover:text-gray-300 py-2 px-3 rounded" aria-label="Navigate to dashboard page">
                            Dashboard
                        </NavLink>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                     {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                            aria-label="Logout"
                             type="button"
                            role="button"
                        >
                             Logout
                        </button>
                    ) : (
                        <NavLink to="/auth" className="hover:text-gray-300 py-2 px-3 rounded" aria-label="Navigate to login/signup page">
                            Login/Signup
                        </NavLink>
                    )}
                </div>
            </nav>
        </header>
    );
};

Header.propTypes = {
    onLogout: PropTypes.func,
};

export default Header;
