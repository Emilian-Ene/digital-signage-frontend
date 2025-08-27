// src/components/PlaylistRow/PlaylistRow.jsx

import React from 'react';
import styles from './PlaylistRow.module.css';
import { FiEdit, FiSend, FiTrash2, FiMonitor, FiSmartphone } from 'react-icons/fi';

const PlaylistRow = ({ playlist }) => {
  const getOrientationTag = (orientation) => {
    switch (orientation) {
      case 'Landscape': return { icon: <FiMonitor />, text: '16x9' };
      case 'Portrait': return { icon: <FiSmartphone />, text: '9x16' };
      default: return { icon: null, text: 'Custom' };
    }
  };
  const orientationTag = getOrientationTag(playlist.orientation);

  return (
    <div className={styles.playlistRow}>
      {/* --- THIS IS THE CORRECTED STRUCTURE --- */}
      <div className={styles.thumbnail}>
        <FiMonitor />
      </div>
      
      <div className={styles.details}>
        <span className={styles.name}>{playlist.name}</span>
        <span className={styles.duration}>00:00</span>
        <div className={styles.orientationTag}>
          {orientationTag.icon}
          <span>{orientationTag.text}</span>
        </div>
      </div>
      
      {/* Spacer div to push actions to the right */}
      <div className={styles.spacer}></div> 

      <div className={styles.actions}>
        <button className={styles.actionBtn} title="Edit"><FiEdit /></button>
        <button className={styles.actionBtn} title="Publish"><FiSend /></button>
        <button className={styles.actionBtn} title="Delete"><FiTrash2 /></button>
      </div>
      {/* --- End of corrected structure --- */}
    </div>
  );
};

export default PlaylistRow;