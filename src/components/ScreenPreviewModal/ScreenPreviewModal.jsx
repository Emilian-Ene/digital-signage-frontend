// src/components/ScreenPreviewModal/ScreenPreviewModal.jsx

import React from 'react';
import Modal from '../Modal/Modal';
import styles from './ScreenPreviewModal.module.css';
import PlaylistPreview from '../PlaylistPreview/PlaylistPreview';
import { FiX } from 'react-icons/fi';

const ScreenPreviewModal = ({ isOpen, onClose, screen }) => {
  if (!isOpen || !screen) {
    return null;
  }

  const playlist = screen.assignedContent?.contentId;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>
          
          {/* --- THIS IS THE NEW FLEXBOX HEADER STRUCTURE --- */}
          <div className={styles.title}>
            Live Preview: <span className={styles.screenName}>{screen.name}</span>
          </div>

          {playlist && (
            <div className={styles.playlistNameInfo}>
              Now Playing: {playlist.name}
            </div>
          )}

          <button onClick={onClose} className={styles.closeBtn}><FiX /></button>
          {/* --- END OF NEW STRUCTURE --- */}

        </div>
        <div className={styles.content}>
          <PlaylistPreview playlist={playlist} />
        </div>
      </div>
    </Modal>
  );
};

export default ScreenPreviewModal;