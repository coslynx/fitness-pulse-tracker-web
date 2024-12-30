import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import Button from './Button';
import Modal from './Modal';
import useForm from '../hooks/useForm';
import goalService from '../services/goal';
import useAuth from '../hooks/useAuth';
import { formatDate } from '../utils/helpers';

/**
 * GoalForm Component.
 * Renders a form for creating or updating a user's fitness goal.
 * Uses the useForm hook for form handling, and interacts with the goalService.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function called when the modal is closed.
 * @param {object} [props.goal] - If provided, the form will be populated with this goal's data and will act as an update form instead of a creation form.
 * @param {function} [props.onSubmitSuccess] - An optional callback that will be called when the goal creation or update is successfully performed.
 * @returns {JSX.Element} The GoalForm component.
 */
const GoalForm = ({ isOpen, onClose, goal, onSubmitSuccess }) => {
    const { user } = useAuth();
    const { createGoal, updateGoal } = goalService();
    const [formError, setFormError] = useState('');


  const initialValues = {
    name: goal?.name || '',
    description: goal?.description || '',
      startDate: goal?.startDate ? formatDate(goal.startDate, 'YYYY-MM-DD') : '',
    targetDate: goal?.targetDate ? formatDate(goal.targetDate, 'YYYY-MM-DD') : '',
    targetValue: goal?.targetValue || '',
    unit: goal?.unit || '',
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
        if (!values.name) {
          errors.name = 'Name is required';
        }
        if (!values.description) {
          errors.description = 'Description is required';
        }
          if (!values.startDate) {
              errors.startDate = 'Start Date is required';
        }
         if (!values.targetDate) {
             errors.targetDate = 'Target Date is required';
        }
        if (!values.targetValue) {
            errors.targetValue = 'Target value is required';
        } else if (isNaN(Number(values.targetValue)) || Number(values.targetValue) <= 0) {
            errors.targetValue = 'Target value must be a positive number';
        }
          if (!values.unit) {
              errors.unit = 'Unit is required';
        }

        return errors;
      },
    onSubmit: async (values) => {
          try {
            const startDate = new Date(values.startDate);
            const targetDate = new Date(values.targetDate);
            const targetValue = Number(values.targetValue);


              let response;
                if (goal && goal.id) {
                    response = await updateGoal(goal.id, values.name, values.description, startDate, targetDate, targetValue, values.unit);
                    if(response){
                        if (onSubmitSuccess) {
                             onSubmitSuccess(response);
                         }
                    }
                } else{
                    response = await createGoal(user.userId, values.name, values.description, startDate, targetDate, targetValue, values.unit);
                    if(response){
                       if (onSubmitSuccess) {
                             onSubmitSuccess(response);
                         }
                     }
                }

              resetForm();
              onClose();
        } catch (error) {
              if (error.message) {
                  setFormError(error.message);
                } else{
                    setFormError('Failed to submit the form: Internal server error');
                }
        }
    },
  });
    
    const handleClose = () => {
        resetForm();
        onClose();
        setFormError('');
    };
    
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={goal ? 'Edit Goal' : 'Add Goal'}>
      <form onSubmit={handleSubmit} className="bg-white  rounded px-8 pt-6 pb-8 mb-4">
          {formError && <div className="text-red-500 text-sm mb-4">{formError}</div>}
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
           {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>
          <div className="mb-4">
              <Input
                  type="date"
                  placeholder="Start Date"
                  name="startDate"
                   value={values.startDate}
                  onChange={handleChange}
              />
              {errors.startDate && <p className="text-red-500 text-xs italic">{errors.startDate}</p>}
          </div>
          <div className="mb-4">
              <Input
                  type="date"
                  placeholder="Target Date"
                  name="targetDate"
                   value={values.targetDate}
                  onChange={handleChange}
              />
              {errors.targetDate && <p className="text-red-500 text-xs italic">{errors.targetDate}</p>}
          </div>
        <div className="mb-4">
          <Input
            type="number"
            placeholder="Target Value"
            name="targetValue"
            value={values.targetValue}
            onChange={handleChange}
          />
            {errors.targetValue && <p className="text-red-500 text-xs italic">{errors.targetValue}</p>}
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Unit (e.g., kg, lbs)"
            name="unit"
            value={values.unit}
            onChange={handleChange}
          />
            {errors.unit && <p className="text-red-500 text-xs italic">{errors.unit}</p>}
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : (goal ? 'Update Goal' : 'Add Goal')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};


GoalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
    goal: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        startDate: PropTypes.string,
        targetDate: PropTypes.string,
        targetValue: PropTypes.number,
        unit: PropTypes.string,
    }),
    onSubmitSuccess: PropTypes.func,
};

export default GoalForm;
