// src/pages/PlaylistsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import CreatePlaylistModal from '../components/CreatePlaylistModal/CreatePlaylistModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import OfflineContent from '../components/OfflineContent/OfflineContent';
import styles from './PlaylistsPage.module.css';

const API_BASE_URL = 'http://localhost:3000/api';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const fetchPlaylists = useCallback(async () => {
    // This function remains the same
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
    // This function remains the same
  };

  return (
    <div className="page-container">
      <MainHeader title="Playlists" actions={headerActions} />
      
      {/* ✅ This section is updated to handle centering */}
      <div className={styles.contentArea}>
        {isLoading ? (
          <p className="loading-message">Loading playlists...</p>
        ) : error ? (
          <OfflineContent onRetry={fetchPlaylists} />
        ) : playlists.length > 0 ? (
          <div className={styles.playlistGrid}>
            {playlists.map(playlist => (
              <PlaylistCard 
                key={playlist._id} 
                playlist={playlist} 
                onDeleteClick={showDeleteConfirmation} 
              />
            ))}
          </div>
        ) : (
          <p className="empty-message">No playlists found. Click "+ Create" to start.</p>
        )}
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