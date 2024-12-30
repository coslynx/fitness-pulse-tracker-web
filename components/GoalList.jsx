import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GoalCard from './GoalCard';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';
import goalService from '../services/goal';
import { sanitizeInput } from '../utils/helpers';

/**
 * GoalList Component.
 * Fetches and displays a list of user goals.
 * Uses useAuth to access the user's ID and useFetch to make GET requests to the /api/goals endpoint.
 * Renders GoalCard components for each goal.
 * @param {object} props - The component props.
 * @param {function} props.onGoalUpdated - Function to call when goals are updated
 * @returns {JSX.Element} The GoalList component.
 */
const GoalList = ({ onGoalUpdated }) => {
    // Get the user object from the useAuth hook
    const { user } = useAuth();
    // Initialize state variable to hold goals data
    const [goals, setGoals] = useState(null);
    // Extract the getGoals function from the goalService
    const { getGoals } = goalService();
    // Initialize state variables to manage loading state and error message
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    /**
     * Fetches goals from the API using the goal service
     * @param {string} userId - The id of the current user
     */
    const fetchGoals = async (userId) => {
        setLoading(true);
         setError(null);
        try {
            const fetchedGoals = await getGoals(userId);
            setGoals(fetchedGoals);
             setLoading(false);
             setError(null);
        } catch (err) {
             if (err.message) {
                 setError(err.message);
             }else{
                  setError('Failed to load goals: Internal server error');
             }
           
            console.error('Error fetching goals:', err);
            setLoading(false);
        }
    };


    /**
     * useEffect hook to fetch goals upon component mount and when user updates goal
     */
    useEffect(() => {
         if (user && user.userId) {
            fetchGoals(user.userId);
         }
            // Cleanup function to reset data when unmounting
            return () => {
                setGoals(null);
                setLoading(false);
                setError(null);
            };
        }, [user, getGoals, onGoalUpdated]);


    /**
     * Handles the share action
     * @param {string} goalId - The id of the goal to share
     */
    const handleShare = (goalId) => {
        // Sanitize goal id
       const sanitizedGoalId = sanitizeInput(goalId);
       // Log share action for MVP purposes
        console.log(`Sharing goal with ID: ${sanitizedGoalId}`);
    };


    // Render loading message if data is being fetched
    if (loading) {
        return <div className="text-center mt-4">Loading goals...</div>;
    }

    // Render error message if there was an error during fetch
    if (error) {
      return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
    }

    // Render message if there are no goals
    if (!goals || goals.length === 0) {
        return <div className="text-center mt-4">No goals set yet.</div>;
    }

    // Render GoalCard components for each goal, using array map
    return (
        <div className="mt-4">
            {goals && Array.isArray(goals) && goals.map((goal) => (
                <GoalCard
                    key={goal.id}
                    goal={goal}
                    onShare={handleShare}
                />
            ))}
        </div>
    );
};

// Define prop types for the GoalList component
GoalList.propTypes = {
  onGoalUpdated: PropTypes.func,
};

export default GoalList;
