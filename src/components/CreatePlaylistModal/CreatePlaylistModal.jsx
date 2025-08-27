// src/components/CreatePlaylistModal/CreatePlaylistModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import styles from './CreatePlaylistModal.module.css';
import { FiMonitor, FiSmartphone } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:3000/api';

const CreatePlaylistModal = ({ isOpen, onClose, onPlaylistCreated }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [orientation, setOrientation] = useState('Landscape');
  const [isCreating, setIsCreating] = useState(false);

  const isFormValid = playlistName.trim() !== '';

  // Effect to reset the form when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setPlaylistName('');
      setOrientation('Landscape');
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!isFormValid) return;
    setIsCreating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playlistName, orientation: orientation }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create playlist.');
      }
      onPlaylistCreated(); // This triggers the refresh
      onClose(); // This closes the modal
    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsCreating(false); // Re-enable button on error
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.inputGroup}>
          <input
            id="playlist-name" type="text" required placeholder=" "
            className={styles.inputField}
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <label htmlFor="playlist-name" className={styles.inputLabel}>Playlist name</label>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="aspect-ratio" className={styles.inputLabelStatic}>Aspect Ratio</label>
          <div className={styles.selectWrapper}>
            <div className={styles.selectIcon}>
              {orientation === 'Landscape' ? <FiMonitor /> : <FiSmartphone />}
            </div>
            <select
              id="aspect-ratio" className={styles.selectField}
              value={orientation} onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="Landscape">Landscape (16x9)</option>
              <option value="Portrait">Portrait (9x16)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCreate} className={styles.createBtn}
          disabled={!isFormValid || isCreating}
        >
          {isCreating ? 'Creating...' : 'Create playlist'}
        </button>
      </div>
    </Modal>
  );
};

export default CreatePlaylistModal;