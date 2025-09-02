// src/pages/PlaylistsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import CreatePlaylistModal from '../components/CreatePlaylistModal/CreatePlaylistModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import OfflineContent from '../components/OfflineContent/OfflineContent';
import styles from './PlaylistsPage.module.css';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:3000/api';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // ✅ 1. Create a new handler function for when a playlist is created
  const handlePlaylistCreated = () => {
    toast.success('Playlist created successfully!');
    fetchPlaylists(); // Then, refresh the list of playlists
  };

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
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the playlist.');
      }
      toast.success(`Playlist "${playlistToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setPlaylistToDelete(null);
      fetchPlaylists(); // Refresh the list
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="page-container">
      <MainHeader title="Playlists" actions={headerActions} />
      
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
                onDeleteClick={() => showDeleteConfirmation(playlist._id, playlist.name)} 
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
        // ✅ 2. Point the prop to your new handler function
        onPlaylistCreated={handlePlaylistCreated}
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePerformDelete}
        itemName={playlistToDelete?.name}
      />
    </div>
  );
};

export default PlaylistsPage;