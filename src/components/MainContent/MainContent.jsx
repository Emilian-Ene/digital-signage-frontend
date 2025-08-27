// src/components/MainContent/MainContent.jsx

import React, { useState } from 'react';
import styles from './MainContent.module.css';
import PlayerCard from '../PlayerCard';
import PairingModal from '../PairingModal/PairingModal';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import EmptyState from '../EmptyState/EmptyState';

const MainContent = ({
  activePage, screens, isLoading, error, onActionComplete,
  isDeleteModalOpen, setDeleteModalOpen, handlePerformDelete, screenToDelete, showDeleteConfirmation
}) => {

  const [isPairingModalOpen, setPairingModalOpen] = useState(false);

  const handleClosePairingModal = (didPair) => {
    setPairingModalOpen(false);
    if (didPair) {
      onActionComplete();
    }
  };

  const renderHeaderActions = () => {
    switch (activePage) {
      case 'Home':
        return (
          <>
            <button 
              onClick={() => setPairingModalOpen(true)} 
              className={styles.btnPrimary}
            >
              + New screen
            </button>
            <button className={styles.btnLight}>Create emulator</button>
            <button className={styles.btnLight}>Republish content</button>
          </>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Home': return <EmptyState />;
      case 'Screens':
        if (isLoading) return <p className={styles.loadingMessage}>Loading screens...</p>;
        if (error) return <p className={styles.errorMessage}>{error}</p>;
        return screens.length > 0 
          ? (<div className={styles.playerCardGrid}>{screens.map(player => (<PlayerCard key={player._id} player={player} onDeleteClick={showDeleteConfirmation}/>))}</div>)
          : <p className={styles.emptyPageMessage}>No screens found. Click "+ New Screen" on the Home page to pair one.</p>;
      default: return <p className={styles.emptyPageMessage}>{activePage} page coming soon...</p>;
    }
  };

  return (
    <main className={styles.mainContent}>
      <header className={styles.mainHeader}>
        {activePage !== 'Home' && <h2 className={styles.pageTitle}>{activePage}</h2>}
        {activePage === 'Home' && <div className={styles.spacer}></div>}
        <div className={styles.headerActions}>{renderHeaderActions()}</div>
      </header>
      <div className={styles.contentBody}>{renderContent()}</div>
      <PairingModal 
        isOpen={isPairingModalOpen} 
        onRequestClose={handleClosePairingModal}
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePerformDelete}
        screenName={screenToDelete?.name}
      />
    </main>
  );
};

export default MainContent;