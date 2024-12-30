import React from 'react';
import PropTypes from 'prop-types';
import { sanitizeInput } from '../utils/helpers';

/**
 * Reusable input component styled with Tailwind CSS.
 *
 * @param {object} props - The component props.
 * @param {string} [props.type='text'] - HTML type of the input (text, email, password, etc.).
 * @param {string} [props.placeholder=''] - Placeholder text for the input.
 * @param {string} [props.value=''] - Current input value.
 * @param {function} props.onChange - Callback function for input changes.
 * @param {string} [props.name=''] - Name of the input field, used as the key for the field.
 * @returns {JSX.Element} The input element.
 */
const Input = ({ type = 'text', placeholder = '', value = '', onChange, name = '' }) => {
  
  const handleChange = (event) => {
        if (onChange) {
            const sanitizedValue = sanitizeInput(event.target.value);
            onChange({ ...event, target: { ...event.target, value: sanitizedValue }});
        }
    };

    const inputId = name ? `input-${name}` : `input-${Math.random().toString(36).substring(2, 15)}`;

  return (
    <>
        {name && <label htmlFor={inputId} className="block text-gray-700 text-sm font-bold mb-2">{placeholder}</label>}
        <input
            type={type}
            placeholder={name ? '' : placeholder}
            value={value}
             onChange={handleChange}
            name={name}
            id={inputId}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            aria-label={placeholder}
        />
    </>
  );
};

Input.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
};

export default Input;
