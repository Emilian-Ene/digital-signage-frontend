// src/pages/ScreensPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import OfflineContent from '../components/OfflineContent/OfflineContent';
import '../index.css';

const API_BASE_URL = 'http://localhost:3000/api';

// NOTE: We are moving the cache key and getDisplayStatus function outside
// because they are pure helpers and don't need to be part of the component.
const SCREENS_CACHE_KEY = 'pixelFlowScreensCacheWithStatus';

const getDisplayStatus = (player) => {
  if (!player || !player.lastHeartbeat) {
    return { text: 'Offline', className: 'offline' };
  }
  const lastHeartbeat = new Date(player.lastHeartbeat);
  const now = new Date();
  if (isNaN(lastHeartbeat.getTime())) {
    return { text: 'Offline', className: 'offline' };
  }
  const diffInSeconds = (now - lastHeartbeat) / 1000;
  if (diffInSeconds <= 35) {
    return { text: 'Online', className: 'online' };
  } else {
    return { text: 'Offline', className: 'offline' };
  }
};

const ScreensPage = () => {
  const [screens, setScreens] = useState(() => {
    try {
      const cachedScreens = localStorage.getItem(SCREENS_CACHE_KEY);
      return cachedScreens ? JSON.parse(cachedScreens) : [];
    } catch (error) { return []; }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState(null);

  const fetchScreens = useCallback(async (isInitialLoad = true) => {
    // --- THIS IS THE FIX ---
    // If this is a main fetch (not a silent poll), clear any previous error
    // and show the loading state. This gives immediate feedback on "Retry".
    if (isInitialLoad) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/players`);
      if (!response.ok) throw new Error('Could not connect to the server.');
      
      const allPlayers = await response.json();
      const visiblePlayers = allPlayers.filter(player => player.status !== 'unpaired');

      const screensWithStatus = visiblePlayers.map(player => ({
        ...player,
        displayStatus: getDisplayStatus(player)
      }));
      
      setScreens(screensWithStatus);
      localStorage.setItem(SCREENS_CACHE_KEY, JSON.stringify(screensWithStatus));
      // On a successful fetch, ensure the error is cleared.
      setError(null); 
      
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      // Always turn off the main loading spinner after an initial fetch attempt.
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchScreens(true);
    const intervalId = setInterval(() => fetchScreens(false), 5000); // Polls are not "initial loads"
    return () => clearInterval(intervalId);
  }, [fetchScreens]);

  const showDeleteConfirmation = (id, name) => { /* ... unchanged ... */ };
  const handlePerformDelete = async () => { /* ... unchanged ... */ };

  const renderContent = () => {
    // If there's an error, it takes priority. The onRetry will call fetchScreens(true).
    if (error) {
      return <OfflineContent onRetry={() => fetchScreens(true)} />;
    }
    // If we're loading, show the loading message.
    if (isLoading) {
      return <p className="loading-message">Loading screens...</p>;
    }
    // If we have no data, show the empty message.
    if (screens.length === 0) {
      return <p className="empty-message">No paired screens found.</p>;
    }
    // Otherwise, render the list.
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