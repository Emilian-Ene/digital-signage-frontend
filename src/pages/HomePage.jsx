// src/pages/HomePage.jsx

import React, { useState } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import EmptyState from '../components/EmptyState/EmptyState';
import PairingModal from '../components/PairingModal/PairingModal';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [isPairingModalOpen, setPairingModalOpen] = useState(false);
  const navigate = useNavigate();

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
      <MainHeader actions={headerActions} />
      <div className="content-centered">
        <EmptyState />
      </div>
      <PairingModal 
        isOpen={isPairingModalOpen}
        onRequestClose={() => setPairingModalOpen(false)}
        onActionComplete={handleActionComplete} 
      />
    </div>
  );
};

export default HomePage;