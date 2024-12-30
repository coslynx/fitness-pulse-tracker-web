import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import useForm from '../hooks/useForm';
import progressService from '../services/progress';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';

/**
 * ProgressTracker Component.
 * Renders a modal for inputting and tracking user's progress towards a fitness goal.
 * Uses the useForm hook for form handling, and interacts with the progressService.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function called when the modal is closed.
  * @param {function} props.onProgressUpdated - Function called when the progress is updated successfully
 * @returns {JSX.Element} The ProgressTracker component.
 */
const ProgressTracker = ({ isOpen, onClose, onProgressUpdated }) => {
    const { user } = useAuth();
    const { createProgress } = progressService();
    const [formError, setFormError] = useState(null);


    const initialValues = {
        date: '',
        value: '',
    };


    const {
        values,
        handleChange,
        handleSubmit,
        errors,
        resetForm,
        loading,
    } = useForm({
        initialValues,
        validate: (values) => {
            const errors = {};
            if (!values.date) {
                errors.date = 'Date is required';
            }
            if (!values.value) {
                errors.value = 'Progress value is required';
            } else if (isNaN(Number(values.value)) || Number(values.value) <= 0) {
                errors.value = 'Progress value must be a positive number';
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                 const date = new Date(values.date);
                const value = Number(values.value);
                const response = await createProgress(user.userId, '', date, value);
                 if (response) {
                       resetForm();
                        onClose();
                      if (onProgressUpdated) {
                          onProgressUpdated(response);
                      }
                      setFormError(null);
                    }
            } catch (error) {
                 if (error.message) {
                     setFormError(error.message);
                }else{
                     setFormError('Failed to submit the form: Internal server error');
                 }
            }
        },
    });

    const handleClose = () => {
        resetForm();
        onClose();
        setFormError(null);
    };


    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Track Progress">
            <form onSubmit={handleSubmit} className="bg-white  rounded px-8 pt-6 pb-8 mb-4">
                {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
                <div className="mb-4">
                    <Input
                        type="date"
                        placeholder="Date"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
                        aria-label="Date input"
                    />
                     {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
                </div>
                <div className="mb-4">
                    <Input
                        type="number"
                        placeholder="Progress Value"
                        name="value"
                        value={values.value}
                        onChange={handleChange}
                        aria-label="Progress Value input"
                    />
                     {errors.value && <p className="text-red-500 text-xs italic">{errors.value}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <Button type="submit" disabled={loading} aria-label="Add Progress">
                        {loading ? 'Submitting...' : 'Add Progress'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

ProgressTracker.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onProgressUpdated: PropTypes.func.isRequired,
};

export default ProgressTracker;
