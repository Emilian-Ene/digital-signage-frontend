// src/pages/MediaPage.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MainHeader from '../components/MainHeader/MainHeader';
import OfflineContent from '../components/OfflineContent/OfflineContent';
import MediaCard from '../components/MediaCard/MediaCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import '../index.css';
import styles from './MediaPage.module.css';
import { FiUpload, FiFolder } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:3000/api';

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/media`);
      if (!response.ok) throw new Error('Could not connect to the server.');
      const data = await response.json();
      setMedia(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileSelectedAndUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('mediaFile', file);
    const friendlyName = file.name.replace(/\.[^/.]+$/, "");
    formData.append('friendlyName', friendlyName);
    if (file.type.startsWith('image')) {
      formData.append('duration', 10);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Upload failed.');
      fetchMedia();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const headerActions = (
    <div className={styles.headerActions}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelectedAndUpload} 
        style={{ display: 'none' }} 
        accept="image/*,video/*"
      />
      <button 
        onClick={() => fileInputRef.current.click()} 
        className={styles.btnPrimary}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : <><FiUpload /> Upload media</>}
      </button>
      <button className={styles.btnLight} disabled={isUploading}>Create Folder</button>
    </div>
  );

  const showDeleteConfirmation = (id, name) => {
    setMediaToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handlePerformDelete = async () => {
    if (!mediaToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/media/${mediaToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete media.');
      }
      setDeleteModalOpen(false);
      setMediaToDelete(null);
      fetchMedia(); // Refresh the list
    } catch (error) {
      alert(`Error: ${error.message}`);
      setDeleteModalOpen(false);
    }
  };

  const renderContent = () => {
    if (error) return <OfflineContent onRetry={fetchMedia} />;
    if (isLoading) return <p className="loading-message">Loading media...</p>;
    
    if (media.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}><FiFolder /></div>
          <h2 className={styles.emptyStateTitle}>Here you can find all of your files.</h2>
          <p className={styles.emptyStateText}>You can upload them by clicking the 'Upload media' button.</p>
        </div>
      );
    }

    return (
      <div className={styles.mediaGrid}>
        {media.map(item => (
          <MediaCard 
            key={item._id} 
            media={item}
            onDeleteClick={() => showDeleteConfirmation(item._id, item.friendlyName)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      <MainHeader title="Media" actions={headerActions} />
      <div className={styles.storageBar}>
        <div className={styles.storageInfo}>
          <span>Used storage capacity: 0 B / 5 GB</span>
          <span>remaining: 5 GB</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: '0%' }}></div>
        </div>
      </div>
      <div className="list-container">
        {renderContent()}
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePerformDelete}
        screenName={mediaToDelete?.name}
      />
    </div>
  );
};

export default MediaPage;