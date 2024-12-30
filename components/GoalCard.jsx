import React from 'react';
import PropTypes from 'prop-types';
import ShareButton from './ShareButton';
import { sanitizeInput } from '../utils/helpers';
import '../styles/global.css';

/**
 * GoalCard Component.
 * Displays a user's fitness goal, including its name, description, and target value, along with a "Share" button.
 * Receives goal data as a prop.
 *
 * @param {object} props - The component props.
 * @param {object} props.goal - The goal object, including id, name, description, targetValue, and unit.
 * @param {function} props.onShare - Callback function for sharing the goal.
 * @returns {JSX.Element} The GoalCard component.
 */
const GoalCard = ({ goal, onShare }) => {
  // Destructure properties from the goal prop, using default values for safety
  const {
    id = '',
    name = '',
    description = '',
    targetValue = 0,
    unit = '',
  } = goal || {};


   const sanitizedName = sanitizeInput(name);
   const sanitizedDescription = sanitizeInput(description);
   const sanitizedUnit = sanitizeInput(unit);
  
  /**
   * Handles the share action and calls the onShare callback
   * @param {string} goalId - The id of the goal
   */
    const handleShare = (goalId) => {
        if (onShare) {
           onShare(goalId);
        }
    };


  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col" aria-label={`Goal card for ${sanitizedName}`}>
      {/* Goal name */}
      <h3 className="text-xl font-semibold mb-2 text-gray-800" aria-label={`Goal name: ${sanitizedName}`}>
        {sanitizedName}
      </h3>

      {/* Goal description */}
      <p className="text-gray-700 mb-2" aria-label={`Goal description: ${sanitizedDescription}`}>
        {sanitizedDescription}
      </p>

      {/* Target value and unit */}
      <div className="mb-2 text-gray-600" aria-label={`Target value: ${targetValue} ${sanitizedUnit}`}>
        Target: {targetValue} {sanitizedUnit}
      </div>

      {/* Share button */}
        <div className="mt-auto">
           <ShareButton onShare={() => handleShare(id)} aria-label={`Share goal: ${sanitizedName}`}/>
        </div>
    </div>
  );
};

// Define prop types for the GoalCard component
GoalCard.propTypes = {
    goal: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        targetValue: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
    }).isRequired,
  onShare: PropTypes.func.isRequired,
};

export default GoalCard;
