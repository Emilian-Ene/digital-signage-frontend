// src/components/EmptyState/EmptyState.jsx


import React from 'react';

import styles from './EmptyState.module.css';
import { FiDownload, FiGrid, FiPlusCircle } from 'react-icons/fi';

const EmptyState = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>How to connect your screens with PixelFlow?</h2>
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <FiDownload className={styles.icon} />
          <h3 className={styles.cardTitle}>Download the PixelFlow App</h3>
          <p className={styles.cardSubtitle}>from Google Play</p>
        </div>
        <div className={styles.card}>
          <FiGrid className={styles.icon} />
          <h3 className={styles.cardTitle}>Launch the App and you will see</h3>
          <p className={styles.cardSubtitle}>a pin code</p>
        </div>
        <div className={styles.card}>
          <FiPlusCircle className={styles.icon} />
          <h3 className={styles.cardTitle}>Click the 'New Screen' button</h3>
          <p className={styles.cardSubtitle}>and enter the pin code</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;