// src/components/PlaylistPreview/PlaylistPreview.jsx
import React, { useState, useEffect } from 'react';
import styles from './PlaylistPreview.module.css';

const API_BASE_URL = 'http://localhost:3000';

const PlaylistPreview = ({ playlist }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    if (!playlist?.items?.length) return;
    const currentItem = playlist.items[currentItemIndex];
    if (currentItem.media.mediaType !== 'image') return; // Only loop images for now
    
    const duration = (currentItem.duration || 5) * 1000;
    const timer = setTimeout(() => {
      setCurrentItemIndex((prevIndex) => (prevIndex + 1) % playlist.items.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentItemIndex, playlist]);

  if (!playlist?.items?.length) {
    return <div className={styles.previewBox}><span className={styles.noContent}>No Content Assigned</span></div>;
  }

  const currentItem = playlist.items[currentItemIndex];
  const media = currentItem.media;
  const isImage = media.mediaType === 'image';
  const fileUrl = `${API_BASE_URL}${media.fileUrl}`;

  return (
    <div className={styles.previewBox}>
      {isImage ? (
        <img src={fileUrl} alt={media.friendlyName} className={styles.media} />
      ) : (
        <video 
          key={fileUrl}
          className={styles.media} 
          src={fileUrl} 
          autoPlay 
          muted 
          onEnded={() => setCurrentItemIndex((prevIndex) => (prevIndex + 1) % playlist.items.length)}
        />
      )}
    </div>
  );
};
export default PlaylistPreview;