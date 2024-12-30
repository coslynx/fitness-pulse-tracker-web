import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

/**
 * Auth Component.
 * Renders the authentication page with both login and signup forms.
 * @returns {JSX.Element} The Auth component.
 */
const Auth = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100" role="main" aria-label="Authentication Page">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <LoginForm />
        <SignupForm />
      </div>
    </div>
  );
};

export default Auth;
