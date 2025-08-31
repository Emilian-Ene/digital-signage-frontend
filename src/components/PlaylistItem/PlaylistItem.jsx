import React from 'react';
import styles from './PlaylistItem.module.css';
// ✅ CHANGED: Replaced 'FiGripVertical' with 'FiMenu'
import { FiMenu, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_BASE_URL = 'http://localhost:3000';

const PlaylistItem = ({ id, item, onDelete, onDurationChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  // This check is robust against items with null media
  const media = item?.media;
  if (!media) return null; // Don't render if media is missing

  const isVideo = media.mediaType === 'video';
  const thumbnailUrl = `${API_BASE_URL}${media.fileUrl}`;

  return (
    <div ref={setNodeRef} style={style} className={styles.playlistItem}>
      <button {...listeners} {...attributes} className={styles.dragHandle}>
        {/* ✅ CHANGED: Replaced the icon component here as well */}
        <FiMenu />
      </button>

      <div className={styles.thumbnail}>
        {isVideo ? (
          <video 
            src={thumbnailUrl} 
            className={styles.previewMedia} 
            muted 
            preload="metadata" 
          />
        ) : (
          <img 
            src={thumbnailUrl} 
            alt={media.friendlyName} 
            className={styles.previewMedia} 
          />
        )}
      </div>

      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{media.friendlyName}</span>
        <span className={styles.itemType}>{media.mediaType}</span>
      </div>
      
      <div className={styles.duration}>
        <input 
          type="number" 
          className={styles.durationInput} 
          value={item.duration}
          onChange={(e) => onDurationChange(parseInt(e.target.value, 10))}
        />
        <span>s</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Preview"><FiEye /></button>
        <button className={styles.iconBtn} title="Edit"><FiEdit2 /></button>
        <button className={styles.iconBtn} title="Delete" onClick={onDelete}><FiTrash2 /></button>
      </div>
    </div>
  );
};

export default PlaylistItem;