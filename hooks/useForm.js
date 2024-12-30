import { useState, useCallback } from 'react';
import { sanitizeInput } from '../utils/helpers';

/**
 * Custom React hook for managing form state, handling input changes, and providing form submission functionality.
 * @param {Object} initialValues - An object representing the initial form state.
 * @param {function} onSubmit - An async callback function that is triggered when the form is submitted and validated without any errors.
 * @param {function} [validate] - An optional function that should be used to validate the form values, returning an errors object.
 * @returns {{
 *   values: Object,
 *   handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 *   handleSubmit: (event: React.FormEvent) => Promise<void>,
 *   errors: Object,
 *   resetForm: () => void,
  *  loading: boolean,
 * }} An object containing the form data, handlers, errors, reset function and loading state.
 *
 * @example
 * const MyForm = () => {
 *   const { values, handleChange, handleSubmit, errors, resetForm } = useForm({
 *     initialValues: { name: '', email: '', message: '', terms: false },
 *     onSubmit: async (values) => {
 *       console.log('Form values:', values);
 *       // Perform asynchronous actions (e.g., API call) here
 *        await new Promise(resolve => setTimeout(resolve, 1000));
 *       console.log('Form submitted successfully');
 *     },
 *     validate: (values) => {
 *       const errors = {};
 *       if (!values.name) errors.name = 'Field is required';
 *       if (!values.email) errors.email = 'Field is required';
 *       if (!values.message) errors.message = 'Field is required';
 *       if (!values.terms) errors.terms = 'You must accept the terms';
 *       return errors;
 *     },
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input type="text" name="name" value={values.name} onChange={handleChange} />
 *       {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
 *
 *       <input type="email" name="email" value={values.email} onChange={handleChange} />
 *       {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
 *
 *      <textarea name="message" value={values.message} onChange={handleChange} />
 *       {errors.message && <span style={{ color: 'red' }}>{errors.message}</span>}
 *
 *      <input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} />
        {errors.terms && <span style={{ color: 'red' }}>{errors.terms}</span>}
 *
 *       <button type="submit">Submit</button>
 *        <button type="button" onClick={resetForm}>Reset</button>
 *     </form>
 *   );
 * };
 */
const useForm = ({ initialValues, onSubmit, validate }) => {
    const [values, setValues] = useState(initialValues || {});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    /**
     * Memoized callback function to handle input changes.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - The input change event.
     */
    const handleChange = useCallback((event) => {
         const { name, value, type, checked } = event.target;

            let sanitizedValue;

            if (type === 'checkbox') {
                sanitizedValue = checked;
            }else{
                sanitizedValue = sanitizeInput(value);
            }


            setValues((prevValues) => ({
                 ...prevValues,
                 [name]: sanitizedValue,
             }));
            setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        }, [setValues, setErrors]);
    
    /**
     * Async function to handle form submission.
     * @param {React.FormEvent} event - The form submit event.
     */
    const handleSubmit = useCallback(async (event) => {
            event.preventDefault();
             setLoading(true);
            try {
              if (validate) {
                   const validationErrors = validate(values);
                   setErrors(validationErrors);
                   if (Object.keys(validationErrors).length > 0) {
                     setLoading(false);
                      return; // Stop submission if errors exist
                  }
              }
               await onSubmit(values);
               setLoading(false);
            } catch (error) {
                console.error('Error during form submission:', error);
                 setLoading(false);
            }
        }, [values, onSubmit, validate, setLoading, setErrors]);


    /**
     * Function to reset form values to initial values
     */
    const resetForm = useCallback(() => {
          setValues(initialValues || {});
        setErrors({});
      }, [initialValues, setValues, setErrors]);
    
    return {
        values,
        handleChange,
        handleSubmit,
        errors,
        resetForm,
        loading
    };
};

export default useForm;
