import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable button component styled with Tailwind CSS.
 *
 * @param {object} props - The component props.
 * @param {function} props.onClick - Function called when the button is clicked.
 * @param {React.ReactNode} props.children - Content of the button.
 * @param {string} [props.type='button'] - HTML type of the button.
 * @param {boolean} [props.disabled=false] - If true, disables the button.
 * @returns {JSX.Element} The button element.
 */
const Button = ({ onClick, children, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
        disabled ? 'disabled:bg-gray-400 disabled:cursor-not-allowed' : ''
      }`}
        role="button"
        aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
