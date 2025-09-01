import React, { useState, useEffect, useRef } from "react";
import styles from "./PlaylistPreview.module.css";

const API_BASE_URL = "http://localhost:3000";

const PlaylistPreview = ({ playlist }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const videoRef = useRef(null);

  // This effect handles the timer for IMAGES
  useEffect(() => {
    if (!playlist?.items?.length) return;
    const currentItem = playlist.items[currentItemIndex];

    if (
      currentItem &&
      currentItem.media &&
      currentItem.media.mediaType === "image"
    ) {
      const duration = (currentItem.duration || 5) * 1000;
      const timer = setTimeout(() => {
        setCurrentItemIndex(
          (prevIndex) => (prevIndex + 1) % playlist.items.length
        );
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [currentItemIndex, playlist]);

  // This effect handles playing VIDEOS
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Try to play the video
      videoElement.play().catch((error) => {
        // We can safely ignore the AbortError, as it's expected
        if (error.name !== "AbortError") {
          console.error("Video autoplay was prevented:", error);
        }
      });
    }

    // ✅ FIX: Add a cleanup function
    // This runs when the component unmounts or the slide changes.
    return () => {
      if (videoElement) {
        // Pause the video to prevent the error
        videoElement.pause();
      }
    };
  }, [currentItemIndex]);

  if (!playlist?.items?.length) {
    return (
      <div className={styles.previewBox}>
        <span className={styles.noContent}>No Content Assigned</span>
      </div>
    );
  }

  const currentItem = playlist.items[currentItemIndex];
  if (!currentItem || !currentItem.media) {
    return (
      <div className={styles.previewBox}>
        <span className={styles.noContent}>Loading Next Item...</span>
      </div>
    );
  }

  const media = currentItem.media;
  const isVideo = media.mediaType === "video";
  const fileUrl = `${API_BASE_URL}${media.fileUrl}`;

  return (
    <div className={styles.previewBox}>
      {isVideo ? (
        <video
          ref={videoRef}
          key={fileUrl}
          className={styles.media}
          src={fileUrl}
          autoPlay
          muted
          onEnded={() =>
            setCurrentItemIndex(
              (prevIndex) => (prevIndex + 1) % playlist.items.length
            )
          }
        />
      ) : (
        <img src={fileUrl} alt={media.friendlyName} className={styles.media} />
      )}
    </div>
  );
};

export default PlaylistPreview;
