// src/components/PlaylistRow/PlaylistRow.jsx
import React from 'react';
import styles from './PlaylistRow.module.css';
import { FiList, FiMoreVertical } from 'react-icons/fi';

const PlaylistRow = ({ playlist }) => {
  return (
    <div className={styles.playlistRow}>
      <div className={styles.icon}>
        <FiList />
      </div>
      <div className={styles.name}>{playlist.name}</div>
      <div className={styles.actions}>
        <button className={styles.actionBtn}>
          <FiMoreVertical />
        </button>
      </div>
    </div>
  );
};

export default PlaylistRow;