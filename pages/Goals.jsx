import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GoalList from '../components/GoalList';
import GoalForm from '../components/GoalForm';
import useAuth from '../hooks/useAuth';

/**
 * Goals Component.
 * Renders the user's goals page, displaying existing goals and allowing users to add new ones.
 * Uses the useAuth hook to verify authentication; if the user is not authenticated, they are redirected to '/auth'.
 * Manages the visibility of the goal creation modal and updates the goal list when new goals are added.
 * @returns {JSX.Element} The Goals component.
 */
const Goals = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [goalUpdated, setGoalUpdated] = useState(false);


    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);


    const handleOpenGoalModal = () => {
        setShowGoalModal(true);
    };

    const handleCloseGoalModal = () => {
        setShowGoalModal(false);
    };

    const handleGoalUpdated = () => {
        setGoalUpdated(!goalUpdated);
    };


    if (!user) {
      return null;
    }

    return (
        <div className="flex flex-col min-h-screen" role="main" aria-label="User Goals Page">
            <Header />
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Your Goals</h2>
                        <button
                            onClick={handleOpenGoalModal}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            role="button"
                            aria-label="Add goal button"
                        >
                            Add Goal
                        </button>
                    </div>
                    <GoalList onGoalUpdated={goalUpdated} />
                </div>
            </div>
             <GoalForm isOpen={showGoalModal} onClose={handleCloseGoalModal} onSubmitSuccess={handleGoalUpdated} />
            <Footer />
        </div>
    );
};

export default Goals;
