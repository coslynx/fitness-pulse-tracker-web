import React from 'react';

/**
 * Footer Component.
 * Renders the application footer.
 * @returns {JSX.Element} The Footer component.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center fixed bottom-0 w-full" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto">
        <span>© 2024 TrackFitnessGoals. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
