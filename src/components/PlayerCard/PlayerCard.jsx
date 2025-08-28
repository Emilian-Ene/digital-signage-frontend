// src/components/PlayerCard/PlayerCard.jsx

import React from 'react';
import styles from './PlayerCard.module.css';
import { FiMonitor } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const getDisplayStatus = (player) => {
  // --- THIS IS THE FIX ---
  // First, check if the player or lastHeartbeat data even exists.
  // If not, default to 'Offline'.
  if (!player || !player.lastHeartbeat) {
    return { text: 'Offline', className: 'offline' };
  }

  const lastHeartbeat = new Date(player.lastHeartbeat);
  const now = new Date();
  // Check if lastHeartbeat is a valid date
  if (isNaN(lastHeartbeat.getTime())) {
    return { text: 'Offline', className: 'offline' };
  }

  const diffInSeconds = (now - lastHeartbeat) / 1000;

  if (diffInSeconds <= 35) {
    return { text: 'Online', className: 'online' };
  } else {
    return { text: 'Offline', className: 'offline' };
  }
};

export default function PlayerCard({ player, onDeleteClick }) {
  const displayStatus = getDisplayStatus(player);
  
  return (
    <div className={`${styles.playerCard} ${styles[displayStatus.className]}`}>
      <div className={styles.playerThumbnail}>
        <FiMonitor /> 
      </div>
      <div className={styles.playerDetails}>
        <h3 className={styles.playerName}>{player.name || 'Unnamed Screen'}</h3>
        <div className={styles.playerTags}>
          <div className={styles.playerStatusDot}></div>
          <span className={styles.statusTag}>{displayStatus.text}</span>
        </div>
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