// src/components/MainHeader/MainHeader.jsx

import React from 'react';
import styles from './MainHeader.module.css';

const MainHeader = ({ title, actions }) => {
  return (
    <header className={styles.mainHeader}>
      {/* Render the title with a subtle shadow for better visibility */}
      {title && <h2 className={styles.pageTitle}>{title}</h2>}

      {/* Spacer for alignment if no title but actions exist */}
      {!title && actions && <div className={styles.spacer}></div>}

      {/* Render actions with improved button styles */}
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
};

export default MainHeader;