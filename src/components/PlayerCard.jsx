// src/components/PlayerCard.jsx

import React from 'react';
import styles from './PlayerCard.module.css';
import { FiMonitor } from 'react-icons/fi';

export default function PlayerCard({ player, onDeleteClick }) {
  // Get the status directly from the player prop. It will be 'Online' or 'Offline'.
  const statusClass = player.status.toLowerCase();
  
  return (
    <div className={`${styles.playerCard} ${styles[statusClass]}`}>
      
      <div className={styles.playerThumbnail}>
        <FiMonitor /> 
      </div>

      <div className={styles.playerDetails}>
        <h3 className={styles.playerName}>{player.name || 'Unnamed Screen'}</h3>
        <div className={styles.playerTags}>
          <div className={styles.playerStatusDot}></div>
          {/* Display the status text directly from the player prop */}
          <span className={styles.statusTag}>{player.status}</span>
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