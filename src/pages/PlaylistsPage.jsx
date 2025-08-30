// src/pages/PlaylistsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PlaylistRow from '../components/PlaylistRow/PlaylistRow';
import CreatePlaylistModal from '../components/CreatePlaylistModal/CreatePlaylistModal';
// --- THIS IS THE CORRECTED IMPORT PATH ---
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import OfflineContent from '../components/OfflineContent/OfflineContent';
import '../index.css';

const API_BASE_URL = 'http://localhost:3000/api';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const fetchPlaylists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/playlists`);
      if (!response.ok) throw new Error('Could not connect to the server.');
      const data = await response.json();
      setPlaylists(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const headerActions = (
    <div className="playlist-header-actions">
      <button onClick={() => setCreateModalOpen(true)} className="btn-create">+ Create</button>
      <a href="#" className="help-link">?</a>
    </div>
  );

  const showDeleteConfirmation = (id, name) => {
    setPlaylistToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handlePerformDelete = async () => {
    if (!playlistToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/playlists/${playlistToDelete.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the playlist.');
      }
      setDeleteModalOpen(false);
      setPlaylistToDelete(null);
      fetchPlaylists();
    } catch (error) {
      alert(`Error: ${error.message}`);
      setDeleteModalOpen(false);
    }
  };

  const renderContent = () => {
    if (error) return <OfflineContent onRetry={fetchPlaylists} />;
    if (isLoading) return <p className="loading-message">Loading playlists...</p>;
    if (playlists.length === 0) return <p className="empty-message">No playlists found. Click "+ Create" to start.</p>;
    
    return playlists.map(playlist => (
      <PlaylistRow 
        key={playlist._id} 
        playlist={playlist} 
        onDeleteClick={showDeleteConfirmation} 
      />
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
        onPlaylistCreated={fetchPlaylists}
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePerformDelete}
        screenName={playlistToDelete?.name}
      />
    </div>
  );
};

export default PlaylistsPage;