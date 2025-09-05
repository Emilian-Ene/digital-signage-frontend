// src/pages/PlaylistsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import CreatePlaylistModal from '../components/CreatePlaylistModal/CreatePlaylistModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import OfflineContent from '../components/OfflineContent/OfflineContent'; // Import OfflineContent
import LoadingSpinner from '../components/LoadingSpiner/LoadingSpinner';
import { toast } from 'react-toastify'; // Use global ToastContainer from App.jsx
import styles from './PlaylistsPage.module.css';
import mediaStyles from './MediaPage.module.css';
import { FiFolder } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:3000/api';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const fetchPlaylists = useCallback(async () => {
    setError(null); // Clear any previous errors
    setPlaylists([]); // Reset playlists to avoid showing stale data
    setIsLoading(true); // Show the loading spinner during retry
    try {
      const response = await fetch(`${API_BASE_URL}/playlists`);
      if (!response.ok) throw new Error('Could not connect to the server.');
      const data = await response.json();

      // Simulate a 2-second delay for the spinner
      setTimeout(() => {
        setPlaylists(data);
        setIsLoading(false);
      }, 2000);
    } catch (e) {
      console.error(e);
      setError(e.message); // Set error to trigger OfflineContent
      toast.error(e.message); // Show error toast
      setIsLoading(false); // Stop spinner if there's an error
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
        method: 'DELETE',
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete playlist.');
      }
      setDeleteModalOpen(false);
      setPlaylistToDelete(null);
      fetchPlaylists(); // Refresh the list
      toast.success(`Playlist "${playlistToDelete.name}" deleted successfully!`); // Show success toast
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`); // Show error toast
      setDeleteModalOpen(false);
    }
  };

  const handlePlaylistCreated = () => {
    fetchPlaylists(); // Refresh the list
    toast.success('Playlist created successfully!'); // Show success toast
    setCreateModalOpen(false); // Close the modal
  };

  if (error) return <OfflineContent onRetry={fetchPlaylists} />; // Show OfflineContent when there's an error
  if (isLoading) return <LoadingSpinner />; // Show spinner while loading

  return (
    <div className="page-container">
      <MainHeader title="Playlists" actions={headerActions} />
      <div className={styles.contentArea}>
        {playlists.length > 0 ? (
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
          <div className="list-container">
            <div className={mediaStyles.emptyState}>
              <div className={mediaStyles.emptyStateIcon}><FiFolder /></div>
              <h2 className={mediaStyles.emptyStateTitle}>No playlists yet</h2>
              <p className={mediaStyles.emptyStateText}>Create your first playlist to start scheduling content. Click the <strong>+ Create</strong> button above to get started.</p>
            </div>
          </div>
        )}
      </div>
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onPlaylistCreated={handlePlaylistCreated} // Pass the handler for playlist creation
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePerformDelete}
        screenName={playlistToDelete?.name}
      />
  {/* ToastContainer is provided globally in App.jsx */}
    </div>
  );
};

export default PlaylistsPage;