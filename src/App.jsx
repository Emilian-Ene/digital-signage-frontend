// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [activePage, setActivePage] = useState('Home');
  const [screens, setScreens] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      if (!isInitialLoad) setError(null);
    } catch (e) {
      console.error(e);
      if (isInitialLoad) {
        setError('Could not load screens.');
      }
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  }, []);

  const fetchPlaylists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/playlists`);
      if (!response.ok) throw new Error('Failed to fetch playlists');
      const data = await response.json();
      setPlaylists(data);
    } catch (e) {
      console.error(e);
      setError('Could not load playlists.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- THE FIX IS HERE ---
  useEffect(() => {
    if (activePage === 'Screens') {
      fetchScreens(true);
      const intervalId = setInterval(() => fetchScreens(false), 5000);
      return () => clearInterval(intervalId);
    } else if (activePage === 'Playlists') {
      fetchPlaylists();
    }
  // The dependency array is now correct. It will only re-run on page change.
  }, [activePage]);

  const onActionComplete = () => {
    if (activePage === 'Screens') {
      fetchScreens(true);
    } else if (activePage === 'Playlists') {
      fetchPlaylists();
    }
  };
  
  const showDeleteConfirmation = (id, name) => {
    setDeleteModalOpen(true);
    setScreenToDelete({ id, name });
  };
  
  const handlePerformDelete = async () => {
    if (!screenToDelete) return;
    try {
      await fetch(`${API_BASE_URL}/players/${screenToDelete.id}`, { method: 'DELETE' });
      setDeleteModalOpen(false);
      setScreenToDelete(null);
      onActionComplete();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />
      <MainContent 
        activePage={activePage}
        screens={screens}
        playlists={playlists}
        isLoading={isLoading}
        error={error}
        onActionComplete={onActionComplete}
        isDeleteModalOpen={isDeleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        handlePerformDelete={handlePerformDelete}
        screenToDelete={screenToDelete}
        showDeleteConfirmation={showDeleteConfirmation}
      />
    </div>
  );
}

export default App;