// src/components/PlaylistPreview/PlaylistPreview.jsx
import React, { useState, useEffect, useRef } from 'react'; // ✅ 1. Import useRef
import styles from './PlaylistPreview.module.css';

const API_BASE_URL = 'http://localhost:3000';

const PlaylistPreview = ({ playlist }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const videoRef = useRef(null); // ✅ 2. Create a ref to access the video element

  // This effect handles the timer for IMAGES
  useEffect(() => {
    if (!playlist?.items?.length) return;
    const currentItem = playlist.items[currentItemIndex];

    if (currentItem && currentItem.media && currentItem.media.mediaType === 'image') {
      const duration = (currentItem.duration || 5) * 1000;
      const timer = setTimeout(() => {
        setCurrentItemIndex((prevIndex) => (prevIndex + 1) % playlist.items.length);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [currentItemIndex, playlist]);

  // ✅ 3. Add a new effect to programmatically play VIDEOS when they appear
  useEffect(() => {
    if (videoRef.current) {
      // When the video element is available, tell it to play.
      videoRef.current.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
      });
    }
  }, [currentItemIndex]); // Re-run this check every time the item changes

  if (!playlist?.items?.length) {
    return <div className={styles.previewBox}><span className={styles.noContent}>No Content Assigned</span></div>;
  }

  const currentItem = playlist.items[currentItemIndex];
  if (!currentItem || !currentItem.media) {
    return <div className={styles.previewBox}><span className={styles.noContent}>Loading Next Item...</span></div>;
  }

  const media = currentItem.media;
  const isVideo = media.mediaType === 'video';
  const fileUrl = `${API_BASE_URL}${media.fileUrl}`;

  return (
    <div className={styles.previewBox}>
      {isVideo ? (
        <video 
          ref={videoRef} // ✅ 4. Attach the ref to the video element
          key={fileUrl}
          className={styles.media} 
          src={fileUrl} 
          autoPlay // Keep autoPlay as a fallback
          muted 
          onEnded={() => setCurrentItemIndex((prevIndex) => (prevIndex + 1) % playlist.items.length)}
        />
      ) : (
        <img src={fileUrl} alt={media.friendlyName} className={styles.media} />
      )}
    </div>
  );
};

export default PlaylistPreview;