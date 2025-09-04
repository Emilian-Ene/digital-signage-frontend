// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import EmptyState from '../components/EmptyState/EmptyState';
import PairingModal from '../components/PairingModal/PairingModal';
import LoadingSpinner from '../components/LoadingSpiner/LoadingSpinner'; // Import the spinner
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isPairingModalOpen, setPairingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading spinner visible
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate a 2-second loading delay on page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const handleActionComplete = () => {
    // After a successful pairing, close modal and go to the screens page
    setPairingModalOpen(false);
    navigate('/screens');
  };

  const headerActions = (
    <>
      <button onClick={() => setPairingModalOpen(true)} className="btn btn-primary">+ New screen</button>
      <button className="btn btn-light">Create emulator</button>
      <button className="btn btn-light">Republish content</button>
    </>
  );

  return (
    <div className="page-container">
      {isLoading && <LoadingSpinner />} {/* Conditionally render the spinner */}
      {!isLoading && (
        <>
          <MainHeader actions={headerActions} />
          <div className="content-centered">
            <EmptyState />
          </div>
          <PairingModal 
            isOpen={isPairingModalOpen}
            onRequestClose={() => setPairingModalOpen(false)}
            onActionComplete={handleActionComplete} 
          />
        </>
      )}
    </div>
  );
};

export default HomePage;