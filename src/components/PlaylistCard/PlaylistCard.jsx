// src/components/PlaylistRow/PlaylistRow.jsx

import React from 'react'; // ✅ 1. useRef is no longer needed
import styles from './PlaylistCard.module.css';
import { FiEdit, FiSend, FiTrash2, FiMonitor, FiSmartphone, FiMusic } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

// ✅ 2. This component is now simplified for constant autoplay
const PlaylistRow = ({ playlist, onDeleteClick }) => {
  const orientationTag = playlist.orientation === 'Landscape' ? '16x9' : '9x16';
  
  const firstItem = playlist.items?.[0];
  const firstMedia = firstItem?.media;
  const isVideo = firstMedia?.mediaType === 'video';
  const thumbnailUrl = firstMedia?.fileUrl ? `${API_BASE_URL}${firstMedia.fileUrl}` : null;
  
  const totalDuration = playlist.items.reduce((acc, item) => acc + (item.duration || 0), 0);
  const formattedDuration = new Date(totalDuration * 1000).toISOString().substr(14, 5);

  return (
    <div className={styles.card}>
      <Link to={`/playlists/${playlist._id}`} className={styles.thumbnailLink}>
        <div className={styles.thumbnail}>
          {thumbnailUrl ? (
            isVideo ? (
              <video 
                src={thumbnailUrl} 
                className={styles.previewImage} 
                muted 
                autoPlay // Add this
                loop     // Add this
                preload="metadata" 
              />
            ) : (
              <img src={thumbnailUrl} alt={playlist.name} className={styles.previewImage} />
            )
          ) : (
            <FiMusic className={styles.fallbackIcon} />
          )}
        </div>
      </Link>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <span className={styles.name}>{playlist.name}</span>
          <span className={styles.orientationTag}>{orientationTag}</span>
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.duration}>{formattedDuration}</span>
          <div className={styles.actions}>
            <button className={styles.actionBtn} title="Publish"><FiSend /></button>
            <Link to={`/playlists/${playlist._id}`} className={styles.actionBtn} title="Edit"><FiEdit /></Link>
            <button 
              className={styles.actionBtn} 
              title="Delete"
              onClick={() => onDeleteClick(playlist._id, playlist.name)}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistRow;