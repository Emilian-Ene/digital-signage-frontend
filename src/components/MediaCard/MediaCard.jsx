// src/components/MediaCard/MediaCard.jsx

import React from 'react'; // ✅ 1. useRef is no longer needed
import styles from './MediaCard.module.css';
import { FiShare2, FiTrash2, FiMoreVertical } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:3000';

// ✅ 2. This component is now simplified for constant autoplay
const MediaCard = ({ media, onDeleteClick }) => {
  const isVideo = media.mediaType === 'video';
  const fileUrl = `${API_BASE_URL}${media.fileUrl}`;

  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        {isVideo ? (
          <video
            src={fileUrl}
            className={styles.previewImage}
            muted
            autoPlay // Add this
            loop     // Add this
            preload="metadata"
          />
        ) : (
          <img 
            src={fileUrl} 
            alt={media.friendlyName} 
            className={styles.previewImage} 
          />
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={styles.fileName} title={media.friendlyName}>
          {media.friendlyName}
        </p>
        <div className={styles.cardActions}>
          <span className={styles.publishText}>Publish</span>
          <div className={styles.actionButtons}>
            <button className={styles.iconBtn} title="Share"><FiShare2 /></button>
            <button 
              className={styles.iconBtn} 
              title="Delete"
              onClick={onDeleteClick}
            >
              <FiTrash2 />
            </button>
            <button className={styles.iconBtn} title="More"><FiMoreVertical /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;