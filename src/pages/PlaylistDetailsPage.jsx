// src/pages/PlaylistDetailsPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import styles from './PlaylistDetailsPage.module.css';
import mediaStyles from './MediaPage.module.css';
import {
  FiArrowLeft, FiEdit, FiList, FiCalendar, FiUpload, FiSearch,
  FiGrid, FiImage, FiPenTool, FiLayers, FiChevronDown, FiMonitor, FiSmartphone, FiFolder
} from 'react-icons/fi';
import OfflineContent from '../components/OfflineContent/OfflineContent'; // Import OfflineContent
import PlaylistItem from '../components/PlaylistItem/PlaylistItem';
import LoadingSpinner from '../components/LoadingSpiner/LoadingSpinner';
import { toast } from 'react-toastify'; // Use global ToastContainer from App.jsx
import DeleteConfirmModal from '../components/DeleteConfirmModal/DeleteConfirmModal';
import MainHeader from '../components/MainHeader/MainHeader';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

const API_BASE_URL = 'http://localhost:3000';

const LibraryItem = ({ item, onAdd }) => {
  const isVideo = item.mediaType === 'video';
  const fileUrl = `${API_BASE_URL}${item.fileUrl}`;

  return (
    <div className={styles.libraryItem}>
      <div className={styles.itemThumbnail}>
        {isVideo ? (
          <video
            src={fileUrl}
            className={styles.itemPreviewImage}
            muted
            autoPlay
            loop
            preload="metadata"
          />
        ) : (
          <img src={fileUrl} alt={item.friendlyName} className={styles.itemPreviewImage} />
        )}
      </div>
      <span className={styles.itemName}>{item.friendlyName}</span>
      <button onClick={onAdd} className={styles.addButton}>Add</button>
    </div>
  );
};

const PlaylistDetailsPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeLibraryTab, setActiveLibraryTab] = useState('Media');
  const [playlistItems, setPlaylistItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for editing playlist name
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState('');

  const hasChanges = playlist
    ? JSON.stringify(playlist.items.filter(i => i && i.media).map(i => ({ media: i.media._id, duration: i.duration }))) !==
      JSON.stringify(playlistItems.map(i => ({ media: i.media._id, duration: i.duration })))
    : false;

  const fetchData = useCallback(async () => {
    setError(null);
    setPlaylist(null);
    setIsLoading(true);
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
      setEditableName(playlistData.name); // Initialize editable name
      setMediaLibrary(mediaData);

      const initialItems = (playlistData.items || [])
        .filter(item => item && item.media)
        .map((item, index) => ({
          ...item,
          instanceId: `item-${Date.now()}-${index}`
        }));
      setPlaylistItems(initialItems);
    } catch (e) {
      console.error(e);
      setError(e.message);
      toast.error(e.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  const handleAddItem = (mediaItem) => {
    const newItem = {
      instanceId: `item-${Date.now()}-${Math.random()}`,
      media: mediaItem,
      duration: mediaItem.mediaType === 'image' ? 10 : 0,
    };
    setPlaylistItems(currentItems => [...currentItems, newItem]);
  };

  const handleDeleteItem = (instanceIdToDelete) => {
    // open confirmation modal instead of deleting immediately
    setConfirmState({ isOpen: true, instanceId: instanceIdToDelete });
  };

  // Delete confirmation state
  const [confirmState, setConfirmState] = useState({ isOpen: false, instanceId: null });

  const confirmDelete = () => {
    const idToDelete = confirmState.instanceId;
    setPlaylistItems(currentItems => currentItems.filter(item => item.instanceId !== idToDelete));
    setConfirmState({ isOpen: false, instanceId: null });
    toast.success('Item deleted successfully!');
  };

  const cancelDelete = () => {
    setConfirmState({ isOpen: false, instanceId: null });
  };

  const handleDurationChange = (instanceIdToChange, newDuration) => {
    setPlaylistItems(currentItems => {
      return currentItems.map(item => {
        if (item.instanceId === instanceIdToChange) {
          return { ...item, duration: newDuration };
        }
        return item;
      });
    });
  };

  const handleSavePlaylist = async () => {
    if (!hasChanges) {
      toast.info('No changes to save.'); // Toast for no changes
      return;
    }
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

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save playlist.');
      }

      toast.success('Playlist published successfully!'); // Success toast for publishing
      fetchData(); // Refresh the playlist data
    } catch (error) {
      toast.error(`Error: ${error.message}`); // Error toast for publishing failure
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameSave = async () => {
    if (editableName === playlist.name || !editableName.trim()) {
      setIsEditingName(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/playlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editableName }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update name.');

      setPlaylist(prev => ({ ...prev, name: editableName }));
      toast.success('Playlist name updated!');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setEditableName(playlist.name);
    } finally {
      setIsEditingName(false);
    }
  };

  const handleUploadMedia = () => {
    toast.info('Upload media functionality is not implemented yet.');
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
        const oldIndex = items.findIndex(item => item.instanceId === active.id);
        const newIndex = items.findIndex(item => item.instanceId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (error) return <OfflineContent onRetry={fetchData} />;
  if (isLoading) return <LoadingSpinner />;
  if (!playlist) return <p style={{padding: 40}}>Playlist not found.</p>;

  // Derive the friendly name of the item pending deletion (if any)
  const confirmItemName = confirmState.instanceId
    ? (playlistItems.find(i => i.instanceId === confirmState.instanceId)?.media?.friendlyName)
    : null;

  const renderLibraryContent = () => {
    switch(activeLibraryTab) {
      case 'Media':
        return (
          <>
            {mediaLibrary.map(item =>
              <div className={styles.libraryCard} key={item._id}>
                <LibraryItem
                  item={item}
                  onAdd={() => handleAddItem(item)}
                />
              </div>
            )}
          </>
        );
      default:
        return <p style={{textAlign: 'center', color: '#9ca3af', paddingTop: '20px'}}>Content for {activeLibraryTab} will be here.</p>;
    }
  };

  return (
    <div className={styles.editorLayout}>
      {/* Page-level main header */}
      <MainHeader title={playlist.name} />
      <div className={styles.mainCanvas}>
        <div className={styles.canvasHeader}>
          <div className={styles.titleGroup}>
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className={styles.titleInput}
                  autoFocus
                />
                <button onClick={handleNameSave} className={styles.saveNameBtn}>Save</button>
                <button onClick={() => {
                  setIsEditingName(false);
                  setEditableName(playlist.name);
                }} className={styles.cancelNameBtn}>Cancel</button>
              </>
            ) : (
              <>
                <h2 className={styles.playlistTitle}>{playlist.name}</h2>
                <button onClick={() => setIsEditingName(true)} className={styles.titleEditBtn}>
                  <FiEdit />
                </button>
              </>
            )}
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
                items={playlistItems.map(item => item.instanceId)}
                strategy={verticalListSortingStrategy}
              >
                <div className={styles.playlistItemList}>
                  {playlistItems.map((item) => (
                    <PlaylistItem
                      key={item.instanceId}
                      id={item.instanceId}
                      item={item}
                      onDelete={() => handleDeleteItem(item.instanceId)}
                      onDurationChange={(newDuration) => handleDurationChange(item.instanceId, newDuration)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
              <div className="list-container">
                <div className={mediaStyles.emptyState}>
                  <div className={mediaStyles.emptyStateIcon}><FiFolder /></div>
                  <h2 className={mediaStyles.emptyStateTitle}>This playlist is empty</h2>
                  <p className={mediaStyles.emptyStateText}>Start building your playlist by adding images or videos from your media library. Select content from the library on the right to add it to this playlist.</p>
                </div>
              </div>
          )}
        </div>
      </div>
      <aside className={styles.contentLibrary}>
        <div className={styles.libraryHeader}>
          <button onClick={handleUploadMedia} className={styles.uploadButton}><FiUpload /> Upload media</button>
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
  {/* ToastContainer is provided globally in App.jsx */}
      <DeleteConfirmModal
        isOpen={confirmState.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        screenName={confirmItemName || 'this item'}
      />
    </div>
  );
};

export default PlaylistDetailsPage;