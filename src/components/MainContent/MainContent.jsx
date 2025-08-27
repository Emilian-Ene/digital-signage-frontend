// src/components/MainContent/MainContent.jsx

import React, { useState } from 'react';
import styles from './MainContent.module.css';
import PlayerCard from '../PlayerCard';
import PairingModal from '../PairingModal/PairingModal';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import EmptyState from '../EmptyState/EmptyState';
import PlaylistRow from '../PlaylistRow/PlaylistRow';

const MainContent = ({
  activePage, screens, playlists, isLoading, error, onActionComplete,
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
            <button onClick={() => setPairingModalOpen(true)} className={styles.btnPrimary}>+ New screen</button>
            <button className={styles.btnLight}>Create emulator</button>
            <button className={styles.btnLight}>Republish content</button>
          </>
        );
      case 'Playlists':
        return (
          <div className={styles.playlistHeaderActions}>
            <button className={styles.btnCreate}>+ Create</button>
            <a href="#" className={styles.helpLink}>?</a>
          </div>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (isLoading) return <p className={styles.loadingMessage}>Loading...</p>;
    if (error) return <p className={styles.errorMessage}>{error}</p>;

    switch (activePage) {
      case 'Home':
        return <EmptyState />;
      case 'Screens':
        return screens.length > 0 
          ? (<div className={styles.playerCardGrid}>{screens.map(player => (<PlayerCard key={player._id} player={player} onDeleteClick={showDeleteConfirmation}/>))}</div>)
          : <p className={styles.emptyPageMessage}>No paired screens found. Active screens will appear here.</p>;
      
      case 'Playlists':
        return playlists.length > 0
          ? (<div className={styles.playlistList}>{playlists.map(playlist => (<PlaylistRow key={playlist._id} playlist={playlist} />))}</div>)
          : <p className={styles.emptyPageMessage}>No playlists created yet. Click "+ Create" to start.</p>;

      default: 
        return <p className={styles.emptyPageMessage}>{activePage} page coming soon...</p>;
    }
  };

  return (
    <main className={styles.mainContent}>
      <header className={styles.mainHeader}>
        {activePage !== 'Home' && <h2 className={styles.pageTitle}>{activePage}</h2>}
        {activePage === 'Home' && <div className={styles.spacer}></div>}
        {/* --- BUG FIX: Corrected the function name casing --- */}
        <div className={styles.headerActions}>{renderHeaderActions()}</div>
      </header>

      <div className={styles.contentBody}>
        {renderContent()}
      </div>

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