import React from 'react';
import PropTypes from 'prop-types';
import { sanitizeInput } from '../utils/helpers';

/**
 * ShareButton Component.
 * Renders a button that, when clicked, triggers a share action for a fitness goal.
 * Utilizes the Web Share API if available, otherwise, provides a fallback mechanism that logs the share action to the console.
 * @param {object} props - The component props.
 * @param {function} props.onShare - Function to be called when the share action is triggered. This function should receive a goal ID as an argument.
 * @param {string} [props.aria-label] - Optional aria-label for accessibility.
 * @returns {JSX.Element} The ShareButton component.
 */
const ShareButton = ({ onShare, ariaLabel }) => {

  /**
   * Handles the click event and triggers the share action.
   */
  const handleClick = () => {
    if (onShare) {
      const goalId = onShare();
      if (navigator.share) {
        try {
          navigator.share({
            title: 'Fitness Goal',
            url: window.location.href,
            text: `Check out this fitness goal!`,
          });
          //Share action is already handled by native API
        } catch (error) {
            console.error('Error sharing goal using Web Share API:', error);
             const sanitizedGoalId = sanitizeInput(goalId);
            console.log(`Sharing goal with ID: ${sanitizedGoalId} (fallback due to share API error).`);
        }
      } else {
         const sanitizedGoalId = sanitizeInput(goalId);
           console.log(`Sharing goal with ID: ${sanitizedGoalId} (fallback due to Web Share API not supported).`);
      }
    }
  };


  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        role="button"
        aria-disabled={false}
      aria-label={ariaLabel}
    >
      Share
    </button>
  );
};

ShareButton.propTypes = {
  onShare: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};

export default ShareButton;
