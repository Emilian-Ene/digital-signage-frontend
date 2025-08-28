// src/components/MainHeader/MainHeader.jsx

import React from 'react';
import styles from './MainHeader.module.css';

const MainHeader = ({ title, actions }) => {
  return (
    <header className={styles.mainHeader}>
      {/* Conditionally render the title if it exists */}
      {title && <h2 className={styles.pageTitle}>{title}</h2>}
      
      {/* Conditionally render a spacer if there is no title but there are actions */}
      {!title && actions && <div className={styles.spacer}></div>}
      
      {/* Conditionally render the actions if they exist */}
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
};

// --- THIS IS THE FIX ---
// Add the missing default export line at the end of the file.
export default MainHeader;