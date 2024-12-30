import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProgressChart from '../components/ProgressChart';
import GoalList from '../components/GoalList';
import useAuth from '../hooks/useAuth';
import ProgressTracker from '../components/ProgressTracker';
import GoalForm from '../components/GoalForm';
import { useState } from 'react';

/**
 * Dashboard Component.
 * Renders the user dashboard, displaying a progress chart and a list of the user's fitness goals.
 * Uses the useAuth hook to check if a user is logged in; if not, redirect to the /auth page.
 * @returns {JSX.Element} The Dashboard component.
 */
const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
     const [showProgressModal, setShowProgressModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [goalUpdated, setGoalUpdated] = useState(false);
    const [progressUpdated, setProgressUpdated] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);


    const handleOpenProgressModal = () => {
        setShowProgressModal(true);
    };

    const handleCloseProgressModal = () => {
        setShowProgressModal(false);
    };

      const handleOpenGoalModal = () => {
        setShowGoalModal(true);
    };

    const handleCloseGoalModal = () => {
        setShowGoalModal(false);
    };


    const handleGoalUpdated = () => {
      setGoalUpdated(!goalUpdated)
    }

    const handleProgressUpdated = () => {
      setProgressUpdated(!progressUpdated)
    }

    if (!user) {
      return null;
    }


    return (
        <div className="flex flex-col min-h-screen" role="main" aria-label="User Dashboard">
            <Header />
            <div className="flex-grow">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Your Dashboard</h2>
                         <div className="space-x-2">
                             <button
                                 onClick={handleOpenProgressModal}
                                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
                                  type="button"
                                   role="button"
                                 aria-label="Track progress button"
                            >
                                 Track Progress
                             </button>
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
                    </div>
                    <ProgressChart  />
                    <GoalList onGoalUpdated={goalUpdated}/>
                </div>
            </div>
              <ProgressTracker isOpen={showProgressModal} onClose={handleCloseProgressModal} onProgressUpdated={handleProgressUpdated} />
              <GoalForm isOpen={showGoalModal} onClose={handleCloseGoalModal} onSubmitSuccess={handleGoalUpdated} />
            <Footer />
        </div>
    );
};

export default Dashboard;
