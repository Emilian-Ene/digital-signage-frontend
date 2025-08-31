// src/components/PlaylistItem/PlaylistItem.jsx

import React, { useState } from 'react';
import styles from './PlaylistItem.module.css';
import { FiMove, FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
// --- NEW: Import the necessary tools from dnd-kit ---
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_BASE_URL = 'http://localhost:3000';

const PlaylistItem = ({ id, item, onDelete, onDurationChange }) => {
  const media = item.media;
  const thumbnailUrl = `${API_BASE_URL}${media.fileUrl}`;
  const [duration, setDuration] = useState(item.duration);

  // --- NEW: This is the hook that makes the component draggable ---
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  // This style will be applied to the main div to make it move
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10) || 0;
    setDuration(newDuration);
  };

  const handleBlur = () => {
    onDurationChange(duration);
  };

  return (
    // --- APPLY THE DND PROPS TO THE MAIN DIV ---
    <div ref={setNodeRef} style={style} {...attributes} className={styles.itemRow}>
      
      {/* The drag handle gets the 'listeners' */}
      <div {...listeners} className={styles.dragHandle} title="Drag to reorder">
        <FiMove />
      </div>

      <div className={styles.thumbnail}>
        <img src={thumbnailUrl} alt={media.friendlyName} />
      </div>
      <div className={styles.details}>
        <span className={styles.name}>{media.friendlyName}</span>
        <span className={styles.type}>{media.mediaType}</span>
      </div>
      <div className={styles.spacer}></div>
      <div className={styles.duration}>
        <input 
          type="number" 
          className={styles.durationInput} 
          value={duration}
          onChange={handleDurationChange}
          onBlur={handleBlur}
        />
        <span className={styles.durationLabel}>s</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.actionBtn}><FiEdit /></button>
        <button className={styles.actionBtn}><FiEye /></button>
        <button onClick={onDelete} className={styles.actionBtn}><FiTrash2 /></button>
      </div>
    </div>
  );
};

export default PlaylistItem;