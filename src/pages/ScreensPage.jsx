// src/pages/ScreensPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import '../index.css'; // For global message styles

const API_BASE_URL = 'http://localhost:3000/api';

const ScreensPage = () => {
  const [screens, setScreens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for the delete modal
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState(null);

  const fetchScreens = useCallback(async (isInitialLoad = true) => {
    if (isInitialLoad) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/players`);
      if (!response.ok) throw new Error('Failed to fetch screens');
      const allPlayers = await response.json();
      const visiblePlayers = allPlayers.filter(player => player.status !== 'unpaired');
      setScreens(visiblePlayers);
      if (error) setError(null);
    } catch (e) {
      console.error(e);
      if (isInitialLoad) {
        setError('Could not load screens. Is the backend running?');
      }
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchScreens(true);
    const intervalId = setInterval(() => fetchScreens(false), 5000);
    return () => clearInterval(intervalId);
  }, [fetchScreens]);

  const showDeleteConfirmation = (id, name) => {
    setScreenToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handlePerformDelete = async () => {
    if (!screenToDelete) return;
    try {
      await fetch(`${API_BASE_URL}/players/${screenToDelete.id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      setScreenToDelete(null);
      fetchScreens(true);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="loading-message">Loading screens...</p>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    if (screens.length === 0) {
      return <p className="empty-message">No paired screens found. Active screens will appear here.</p>;
    }
    return screens.map(player => (
      <PlayerCard 
        key={player._id} 
        player={player} 
        onDeleteClick={showDeleteConfirmation} 
      />
    ));
  };

  return (
    <div className="page-container">
      <MainHeader title="Screens" />
      <div className="list-container">
        {renderContent()}
      </div>
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePerformDelete}
        screenName={screenToDelete?.name}
      />
    </div>
  );
};

export default ScreensPage;