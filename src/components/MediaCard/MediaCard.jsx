// src/components/MediaCard/MediaCard.jsx

import React from 'react';
import styles from './MediaCard.module.css';
// FiVideo is no longer needed unless you want a fallback, but FiImage can be removed.
import { FiShare2, FiTrash2, FiMoreVertical } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:3000';

const MediaCard = ({ media, onDeleteClick }) => {
  // ✅ CHANGED: Check for video type specifically for clarity.
  const isVideo = media.mediaType === 'video';
  const fileUrl = `${API_BASE_URL}${media.fileUrl}`;

  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        {/* ✅ CHANGED: This block now handles both images and videos. */}
        {isVideo ? (
          <video
            src={fileUrl}
            className={styles.previewImage} // Reuse the same style as the image
            muted
            preload="metadata" // Helps to load the first frame as a preview
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