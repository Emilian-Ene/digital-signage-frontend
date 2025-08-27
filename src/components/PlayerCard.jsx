// src/components/PlayerCard.jsx

import React from 'react';
import styles from './PlayerCard.module.css';
import { FiMonitor } from 'react-icons/fi';

// --- THIS IS THE CORRECT, FINAL LOGIC FOR CALCULATING DISPLAY STATUS ---
const getDisplayStatus = (player) => {
  // Calculate the time difference since the last heartbeat.
  const lastHeartbeat = new Date(player.lastHeartbeat);
  const now = new Date();
  const diffInSeconds = (now - lastHeartbeat) / 1000;

  // If the last heartbeat was within the last 35 seconds, consider it 'Online'.
  // We use 35s because the backend cron job runs every 30s. This gives a safe buffer.
  if (diffInSeconds <= 35) {
    return { text: 'Online', className: 'online' };
  } else {
    // Otherwise, it's 'Offline'.
    return { text: 'Offline', className: 'offline' };
  }
};

export default function PlayerCard({ player, onDeleteClick }) {
  // Get the calculated display status based on the heartbeat
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
          {/* Display the calculated text */}
          <span className={styles.statusTag}>{displayStatus.text}</span>
        </div>
      </div>

      <div className={styles.playerActions}>
        <button className={styles.iconBtn} title="Settings">
          <i className="fas fa-cog"></i>
        </button>
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