// src/App.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [activePage, setActivePage] = useState('Home');
  const [screens, setScreens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState(null);

  const fetchScreens = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/players`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const allPlayers = await response.json();

      // --- THE FINAL, CORRECT FIX IS HERE ---
      // We filter based on the exact strings from your Mongoose schema.
      const visiblePlayers = allPlayers.filter(player => 
        player.status !== 'Pending' && player.status !== 'unpaired' // <-- Lowercase 'u'
      );
      
      setScreens(visiblePlayers);
    } catch (e) {
      console.error('Failed to load screens:', e);
      setError('Failed to load screens. Is the backend server running?');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activePage === 'Screens') {
      fetchScreens();
      const intervalId = setInterval(() => fetchScreens(false), 5000);
      return () => clearInterval(intervalId);
    }
  }, [activePage, fetchScreens]);

  const onActionComplete = () => {
    fetchScreens();
  };
  
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
        fetchScreens();
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