// src/components/OfflineContent/OfflineContent.jsx

import React from 'react';
import styles from './OfflineContent.module.css';
import { FiWifiOff, FiRefreshCw } from 'react-icons/fi';

const OfflineContent = ({ onRetry }) => {
  return (
    <div className={styles.container}>
      <FiWifiOff className={styles.icon} />
      <h2 className={styles.title}>Could Not Connect to Server</h2>
      <p className={styles.subtitle}>
        Please check your internet connection and try again.
      </p>
      <button onClick={onRetry} className={styles.retryButton}>
        <FiRefreshCw />
        <span>Retry</span>
      </button>
    </div>
  );
};

export default OfflineContent;