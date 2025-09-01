import React from 'react';
import styles from './PlayerCard.module.css';
import { FiMonitor, FiSettings, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';


const API_BASE_URL = 'http://localhost:3000';

const PlayerCard = ({ player, onDeleteClick, onPreviewClick }) => {
  const displayStatus = player.displayStatus || { text: 'Offline', className: 'offline' };
  
  const firstItem = player.assignedContent?.contentId?.items?.[0];
  const firstMedia = firstItem?.media;
  const isVideo = firstMedia?.mediaType === 'video';
  const thumbnailUrl = firstMedia?.fileUrl ? `${API_BASE_URL}${firstMedia.fileUrl}` : null;
  const playlistName = player.assignedContent?.contentId?.name || 'None';

  const renderPreview = () => {
    if (!thumbnailUrl) {
      return <FiMonitor className={styles.fallbackIcon} />;
    }
    if (isVideo) {
      return <video src={thumbnailUrl} className={styles.previewMedia} muted autoPlay loop preload="metadata" />;
    } else {
      return <img src={thumbnailUrl} alt={player.name} className={styles.previewMedia} />;
    }
  };

  return (
    <div className={`${styles.card} ${styles[displayStatus.className]}`}>
      <button onClick={onPreviewClick} className={styles.thumbnail}>
        {renderPreview()}
      </button>

      <div className={styles.cardBody}>
        <div className={styles.playerDetails}>
          <h3 className={styles.playerName}>{player.name || 'Unnamed Screen'}</h3>
          <div className={styles.playerTags}>
            <div className={styles.playerStatusDot}></div>
            <span className={styles.statusTag}>{displayStatus.text}</span>
          </div>
        </div>
        <div className={styles.nowPlaying}>
          <span className={styles.nowPlayingLabel}>Now Playing:</span>
          <span className={styles.nowPlayingName}> {playlistName}</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <Link to={`/screens/${player._id}`} className={styles.iconBtn} title="Settings">
          <FiSettings />
        </Link>
        <button 
          className={styles.iconBtn}
          title="Delete" 
          onClick={() => onDeleteClick(player._id, player.name || 'this screen')}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

export default PlayerCard;