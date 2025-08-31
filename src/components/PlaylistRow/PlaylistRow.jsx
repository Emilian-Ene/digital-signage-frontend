// src/components/PlaylistRow/PlaylistRow.jsx

import React from 'react';
import styles from './PlaylistRow.module.css';
import { FiEdit, FiSend, FiTrash2, FiMonitor, FiSmartphone } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

const PlaylistRow = ({ playlist, onDeleteClick }) => {
  const getOrientationTag = (orientation) => {
    switch (orientation) {
      case 'Landscape': return { icon: <FiMonitor />, text: '16x9' };
      case 'Portrait': return { icon: <FiSmartphone />, text: '9x16' };
      default: return { icon: null, text: 'Custom' };
    }
  };
  const orientationTag = getOrientationTag(playlist.orientation);
  
  // ✅ CHANGED: Added logic to get the media type
  const firstItem = playlist.items?.[0];
  const firstMedia = firstItem?.media; // Safely get the media object
  const isVideo = firstMedia?.mediaType === 'video';
  const thumbnailUrl = firstMedia?.fileUrl ? `${API_BASE_URL}${firstMedia.fileUrl}` : null;

  return (
    <div className={styles.playlistRow}>
      <div className={styles.leftSection}>
        <div className={styles.thumbnail}>
          {/* ✅ CHANGED: This now checks if the media is a video */}
          {thumbnailUrl ? (
            isVideo ? (
              <video src={thumbnailUrl} className={styles.previewImage} muted preload="metadata" />
            ) : (
              <img src={thumbnailUrl} alt={playlist.name} className={styles.previewImage} />
            )
          ) : (
            <FiMonitor />
          )}
        </div>
        <span className={styles.name}>{playlist.name}</span>
      </div>

      <div className={styles.rightSection}>
        <span className={styles.duration}>00:00</span>
        <div className={styles.orientationTag}>
          {orientationTag.icon}
          <span>{orientationTag.text}</span>
        </div>
        <div className={styles.actions}>
          <Link to={`/playlists/${playlist._id}`} className={styles.actionBtn} title="Edit">
            <FiEdit />
          </Link>
          <button className={styles.actionBtn} title="Publish"><FiSend /></button>
          <button 
            className={styles.actionBtn} 
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(playlist._id, playlist.name);
            }}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistRow;