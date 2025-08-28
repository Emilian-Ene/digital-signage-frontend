// src/pages/PlaylistsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PlaylistRow from '../components/PlaylistRow/PlaylistRow';
import CreatePlaylistModal from '../components/CreatePlaylistModal/CreatePlaylistModal';
import '../index.css'; // For global message and button styles

const API_BASE_URL = 'http://localhost:3000/api';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // Function to fetch playlists from the backend
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
      setError('Could not load playlists. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch playlists when the page first loads
  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  // Define the header actions (the buttons)
  const headerActions = (
    <div className="playlist-header-actions">
      <button onClick={() => setCreateModalOpen(true)} className="btn-create">+ Create</button>
      <a href="#" className="help-link">?</a>
    </div>
  );

  // Function to determine what content to show
  const renderContent = () => {
    if (isLoading) {
      return <p className="loading-message">Loading playlists...</p>;
    }
    if (error) {
      return <p className="error-message">{error}</p>;
    }
    if (playlists.length === 0) {
      return <p className="empty-message">No playlists found. Click "+ Create" to start.</p>;
    }
    return playlists.map(playlist => (
      <PlaylistRow key={playlist._id} playlist={playlist} />
    ));
  };

  return (
    <div className="page-container">
      <MainHeader title="Playlists" actions={headerActions} />
      <div className="list-container">
        {renderContent()}
      </div>
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPlaylistCreated={fetchPlaylists} // Directly call fetchPlaylists to refresh the list
      />
    </div>
  );
};

export default PlaylistsPage;