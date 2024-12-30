import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Home Component.
 * Renders the landing page for the application.
 * @returns {JSX.Element} The Home component.
 */
const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">
                <div className="max-w-4xl mx-auto p-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Welcome to TrackFitnessGoals!
                    </h1>
                    <p className="text-lg mb-8">
                        Track your fitness goals, monitor your progress, and share your achievements with friends. Start your journey today!
                    </p>
                    <p className="text-gray-600">
                        This application is designed for fitness enthusiasts who seek a simple and effective way to stay motivated and connected.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
