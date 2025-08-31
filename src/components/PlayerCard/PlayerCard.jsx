// src/components/PlayerCard/PlayerCard.jsx

import React from 'react';
import styles from './PlayerCard.module.css';
import { FiMonitor } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

const PlayerCard = ({ player, onDeleteClick, onPreviewClick }) => {
  
  const displayStatus = player.displayStatus || { text: 'Offline', className: 'offline' };
  
  // ✅ CHANGED: Added logic to safely get the media item and its type
  const firstItem = player.assignedContent?.contentId?.items?.[0];
  const firstMedia = firstItem?.media; // Safely access the media object
  const isVideo = firstMedia?.mediaType === 'video';
  const thumbnailUrl = firstMedia?.fileUrl ? `${API_BASE_URL}${firstMedia.fileUrl}` : null;
  const playlistName = player.assignedContent?.contentId?.name || 'None';

  return (
    <div className={`${styles.playerCard} ${styles[displayStatus.className]}`}>
      <div className={styles.playerInfo}>
        
        <button onClick={onPreviewClick} className={styles.playerThumbnail}>
          {/* ✅ CHANGED: This now checks if the media is a video */}
          {thumbnailUrl ? (
            isVideo ? (
              <video src={thumbnailUrl} className={styles.previewImage} muted preload="metadata" />
            ) : (
              <img src={thumbnailUrl} alt={player.name} className={styles.previewImage} />
            )
          ) : (
            <FiMonitor /> 
          )}
        </button>

        <div className={styles.playerDetails}>
          <h3 className={styles.playerName}>{player.name || 'Unnamed Screen'}</h3>
          <div className={styles.playerTags}>
            <div className={styles.playerStatusDot}></div>
            <span className={styles.statusTag}>{displayStatus.text}</span>
          </div>
        </div>
      </div>

      <div className={styles.nowPlaying}>
        <span className={styles.nowPlayingLabel}>Now Playing:</span>
        <span className={styles.nowPlayingName}>{playlistName}</span>
      </div>
      
      <div className={styles.playerActions}>
        <Link to={`/screens/${player._id}`} className={styles.iconBtn} title="Settings">
          <i className="fas fa-cog"></i>
        </Link>
        <button 
          className={styles.iconBtn}
          title="Delete" 
          onClick={() => onDeleteClick(player._id, player.name || 'this screen')}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}

export default PlayerCard;