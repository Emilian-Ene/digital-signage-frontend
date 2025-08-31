// src/pages/PlaylistDetailsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './PlaylistDetailsPage.module.css';
import { 
  FiArrowLeft, FiEdit, FiList, FiCalendar, FiUpload, FiSearch, 
  FiGrid, FiImage, FiPenTool, FiLayers, FiChevronDown, FiMonitor, FiSmartphone 
} from 'react-icons/fi';
import OfflineContent from '../components/OfflineContent/OfflineContent';
import PlaylistItem from '../components/PlaylistItem/PlaylistItem';

// --- Import from dnd-kit ---
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

const API_BASE_URL = 'http://localhost:3000';

// --- UPDATED SUB-COMPONENT to show thumbnails ---
const LibraryItem = ({ item, onAdd }) => (
  <div className={styles.libraryItem}>
    <div className={styles.itemThumbnail}>
      {item.thumbnailUrl && (
        <img src={item.thumbnailUrl} alt={item.name} className={styles.itemPreviewImage} />
      )}
    </div>
    <span className={styles.itemName}>{item.name}</span>
    <button onClick={onAdd} className={styles.addButton}>Add</button>
  </div>
);

const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeLibraryTab, setActiveLibraryTab] = useState('Media');
  const [playlistItems, setPlaylistItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const hasChanges = playlist 
    ? JSON.stringify(playlist.items.map(i => ({ media: i.media._id, duration: i.duration }))) !== 
      JSON.stringify(playlistItems.map(i => ({ media: i.media._id, duration: i.duration })))
    : false;

  const fetchData = useCallback(async () => {
    if (!playlist) setIsLoading(true);
    setError(null);
    try {
      const [playlistResponse, mediaResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/playlists/${id}`),
        fetch(`${API_BASE_URL}/api/media`)
      ]);
      if (!playlistResponse.ok) throw new Error('Could not load playlist details.');
      if (!mediaResponse.ok) throw new Error('Could not load media library.');
      const playlistData = await playlistResponse.json();
      const mediaData = await mediaResponse.json();
      setPlaylist(playlistData);
      setMediaLibrary(mediaData);
      setPlaylistItems(playlistData.items || []);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [id, playlist]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddItem = (mediaItem) => {
    const newItem = {
      media: mediaItem,
      duration: mediaItem.mediaType === 'image' ? 10 : 0,
    };
    setPlaylistItems(currentItems => [...currentItems, newItem]);
  };

  const handleDeleteItem = (indexToDelete) => {
    setPlaylistItems(currentItems => currentItems.filter((_, index) => index !== indexToDelete));
  };

  const handleDurationChange = (indexToChange, newDuration) => {
    setPlaylistItems(currentItems => {
      const newItems = [...currentItems];
      newItems[indexToChange] = { ...newItems[indexToChange], duration: newDuration };
      return newItems;
    });
  };

  const handleSavePlaylist = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    const itemsToSave = playlistItems.map(item => ({
      media: item.media._id,
      duration: item.duration
    }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/playlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSave }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to save playlist.');
      alert('Playlist saved successfully!');
      fetchData();
    } catch(error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPlaylistItems((items) => {
        const oldIndex = items.findIndex(item => item.media._id === active.id);
        const newIndex = items.findIndex(item => item.media._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (isLoading) return <p className="loading-message" style={{padding: 40}}>Loading Playlist Editor...</p>;
  if (error) return <OfflineContent onRetry={fetchData} />;
  if (!playlist) return <p style={{padding: 40}}>Playlist not found.</p>;

  const renderLibraryContent = () => {
    switch(activeLibraryTab) {
      case 'Media':
        return (
          <div className={styles.itemList}>
            {mediaLibrary.map(item => 
              <LibraryItem 
                key={item._id} 
                item={{
                  name: item.friendlyName,
                  thumbnailUrl: `${API_BASE_URL}${item.fileUrl}`
                }} 
                onAdd={() => handleAddItem(item)}
              />
            )}
          </div>
        );
      default:
        return <p style={{textAlign: 'center', color: '#9ca3af', paddingTop: '20px'}}>Content for {activeLibraryTab} will be here.</p>;
    }
  };

  return (
    <div className={styles.editorLayout}>
      <div className={styles.mainCanvas}>
        <div className={styles.canvasHeader}>
          <div className={styles.titleGroup}>
            <Link to="/playlists" className={styles.backButton}><FiArrowLeft /></Link>
            <h2 className={styles.playlistTitle}>{playlist.name}</h2>
            <button className={styles.titleEditBtn}><FiEdit /></button>
          </div>
          <div className={styles.headerActions}>
            <button className={`${styles.actionButton} ${styles.previewButton}`}>Preview</button>
            <button 
              onClick={handleSavePlaylist}
              disabled={!hasChanges || isSaving}
              className={`${styles.actionButton} ${styles.publishButton}`}
            >
              {isSaving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
        <div className={styles.playlistSettings}>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Aspect ratio</span>
            <div className={styles.settingValue}>
              {playlist.orientation === 'Landscape' ? <FiMonitor/> : <FiSmartphone/>}
              <strong>{playlist.orientation}</strong>
              <span>({playlist.orientation === 'Landscape' ? '16x9' : '9x16'})</span>
              <FiChevronDown className={styles.chevron} />
            </div>
          </div>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Media Fit</span>
            <div className={styles.settingValue}>
              <FiGrid />
              <strong>Contain</strong>
              <FiChevronDown className={styles.chevron} />
            </div>
          </div>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Audience Targeting</span>
            <div className={styles.settingValue}>
              <strong>Disabled</strong>
              <FiChevronDown className={styles.chevron} />
            </div>
          </div>
        </div>
        <div className={styles.layoutSettings}>
            <span className={styles.layoutLabel}>Layout: <strong>Main</strong> <FiChevronDown/></span>
            <div className={styles.viewToggle}>
                <button className={`${styles.toggleBtn} ${styles.active}`}><FiList /> List</button>
                <button className={styles.toggleBtn}><FiCalendar /> Calendar</button>
            </div>
        </div>
        <div className={styles.playlistContent}>
          {playlistItems.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={playlistItems.map(item => item.media._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.playlistItemList}>
                  {playlistItems.map((item, index) => (
                    <PlaylistItem 
                      key={`${item.media._id}-${index}`}
                      id={item.media._id}
                      item={item} 
                      onDelete={() => handleDeleteItem(index)}
                      onDurationChange={(newDuration) => handleDurationChange(index, newDuration)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className={styles.emptyPlaylist}>
              <div className={styles.emptyPlaylistIcon}>🖼️</div>
              <h3>This playlist is empty</h3>
              <p>Select content from the library on the right to change it.</p>
            </div>
          )}
        </div>
      </div>
      <aside className={styles.contentLibrary}>
        <div className={styles.libraryHeader}>
          <button className={styles.uploadButton}><FiUpload /> Upload media</button>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} />
          </div>
        </div>
        <div className={styles.libraryTabs}>
          <button className={`${styles.tab} ${activeLibraryTab === 'Latest' ? styles.active : ''}`} onClick={() => setActiveLibraryTab('Latest')}><FiGrid /> Latest</button>
          <button className={`${styles.tab} ${activeLibraryTab === 'Media' ? styles.active : ''}`} onClick={() => setActiveLibraryTab('Media')}><FiImage /> Media</button>
          <button className={`${styles.tab} ${activeLibraryTab === 'Scenes' ? styles.active : ''}`} onClick={() => setActiveLibraryTab('Scenes')}><FiPenTool /> Scenes</button>
          <button className={`${styles.tab} ${activeLibraryTab === 'Apps' ? styles.active : ''}`} onClick={() => setActiveLibraryTab('Apps')}><FiLayers /> Apps</button>
          <button className={`${styles.tab} ${activeLibraryTab === 'Playlists' ? styles.active : ''}`} onClick={() => setActiveLibraryTab('Playlists')}><FiList /> Playlists</button>
        </div>
        <div className={styles.libraryContent}>
          {renderLibraryContent()}
        </div>
      </aside>
    </div>
  );
};

export default PlaylistDetailsPage;