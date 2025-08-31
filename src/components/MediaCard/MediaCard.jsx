// src/components/MediaCard/MediaCard.jsx

import React from 'react';
import styles from './MediaCard.module.css';
import { FiImage, FiVideo, FiShare2, FiTrash2, FiMoreVertical } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:3000';

// Add 'onDeleteClick' to the props
const MediaCard = ({ media, onDeleteClick }) => {
  const isImage = media.mediaType === 'image';
  const thumbnailUrl = `${API_BASE_URL}${media.fileUrl}`;

  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        {isImage ? (
          <img src={thumbnailUrl} alt={media.friendlyName} className={styles.previewImage} />
        ) : (
          <div className={styles.videoPlaceholder}>
            <FiVideo />
          </div>
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
            {/* This button is now functional */}
            <button 
              className={styles.iconBtn} 
              title="Delete"
              onClick={onDeleteClick} // Use the prop here
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