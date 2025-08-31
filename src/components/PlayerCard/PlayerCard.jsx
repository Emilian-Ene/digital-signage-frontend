// src/components/PlayerCard/PlayerCard.jsx

import React from 'react';
import styles from './PlayerCard.module.css';
import { FiMonitor } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

// getDisplayStatus function is no longer needed here, it's in the parent
const PlayerCard = ({ player, onDeleteClick, onPreviewClick }) => { // <-- Add onPreviewClick prop
  
  // The player object now has a pre-calculated displayStatus
  const displayStatus = player.displayStatus || { text: 'Offline', className: 'offline' };
  
  // Logic to find the thumbnail URL is also simplified
  const firstItem = player.assignedContent?.contentId?.items?.[0];
  const thumbnailUrl = firstItem?.media?.fileUrl ? `${API_BASE_URL}${firstItem.media.fileUrl}` : null;
  const playlistName = player.assignedContent?.contentId?.name || 'None';

  return (
    <div className={`${styles.playerCard} ${styles[displayStatus.className]}`}>
      <div className={styles.playerInfo}>
        
        {/* The thumbnail is now a clickable button */}
        <button onClick={onPreviewClick} className={styles.playerThumbnail}>
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt={player.name} className={styles.previewImage} />
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