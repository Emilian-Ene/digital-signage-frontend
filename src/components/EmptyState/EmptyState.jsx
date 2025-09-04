// src/components/EmptyState/EmptyState.jsx


import React from 'react';

import styles from './EmptyState.module.css';
import { FiDownload, FiGrid, FiPlusCircle } from 'react-icons/fi';

const EmptyState = () => {
  return (
  <div className={styles.container} id="empty-state">
      <h2 className={styles.title}>How to connect your screens with PixelFlow</h2>
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <div className={styles.icon}><FiDownload /></div>
          <h3 className={styles.cardTitle}>Download the PixelFlow App</h3>
          <p className={styles.cardSubtitle}>Get the app from Google Play or the App Store to start pairing your screens.</p>
          <button className={styles.cardButton}>Get the App</button>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}><FiGrid /></div>
          <h3 className={styles.cardTitle}>Open the App</h3>
          <p className={styles.cardSubtitle}>Launch the PixelFlow app and copy the displayed PIN code shown on the screen.</p>
          <button className={styles.cardButton}>Open Guide</button>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}><FiPlusCircle /></div>
          <h3 className={styles.cardTitle}>Add a New Screen</h3>
          <p className={styles.cardSubtitle}>In the app, choose 'New Screen' and enter the PIN to pair the device with your account.</p>
          <button className={styles.cardButton}>Add Screen</button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;