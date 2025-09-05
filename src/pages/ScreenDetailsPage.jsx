// src/pages/ScreenDetailsPage.jsx

import PlaylistPreview from '../components/PlaylistPreview/PlaylistPreview';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader';
import LoadingSpinner from '../components/LoadingSpiner/LoadingSpinner';
import OfflineContent from '../components/OfflineContent/OfflineContent'; // Import OfflineContent
import { toast } from 'react-toastify'; // Use global ToastContainer from App.jsx
import styles from './ScreenDetailsPage.module.css';

const API_BASE_URL = 'http://localhost:3000/api';

const getDisplayStatus = (player) => {
  if (!player || !player.lastHeartbeat) {
    return { text: 'Offline', color: '#dc3545' };
  }
  const lastHeartbeat = new Date(player.lastHeartbeat);
  const now = new Date();
  if (isNaN(lastHeartbeat.getTime())) {
    return { text: 'Offline', color: '#dc3545' };
  }
  const diffInSeconds = (now - lastHeartbeat) / 1000;
  if (diffInSeconds <= 35) {
    return { text: 'Online', color: '#28a745' };
  } else {
    return { text: 'Offline', color: '#dc3545' };
  }
};

const ScreenDetailsPage = () => {
  const { id } = useParams();
  const [screen, setScreen] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState({ text: 'Offline', color: '#dc3545' });

  const [screenName, setScreenName] = useState('');
  const [assignedContentId, setAssignedContentId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = screen
    ? screenName !== screen.name ||
      assignedContentId !== (screen.assignedContent?.contentId?._id || '')
    : false;

  const fetchData = useCallback(async () => {
    setError(null); // Clear any previous errors
    setScreen(null); // Reset screen to null to avoid showing "Screen not found."
    setIsLoading(true); // Show the loading spinner during retry
    try {
      const screenResponse = await fetch(`${API_BASE_URL}/players/${id}`);
      if (!screenResponse.ok) throw new Error('Could not load screen details.');
      const screenData = await screenResponse.json();
      setScreen(screenData);

      if (playlists.length === 0) {
        const playlistsResponse = await fetch(`${API_BASE_URL}/playlists`);
        if (!playlistsResponse.ok) throw new Error('Could not load playlists.');
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData);
      }

      setScreenName(screenData.name || '');
      setAssignedContentId(screenData.assignedContent?.contentId?._id || '');
      const status = getDisplayStatus(screenData);
      setOnlineStatus(status);
    } catch (e) {
      console.error(e);
      setError(e.message); // Set error to trigger OfflineContent
      toast.error(e.message); // Show error toast
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Ensure spinner stays for 2 seconds
      }, 2000);
    }
  }, [id, playlists.length]);

  useEffect(() => {
    fetchData();
  }, [id, fetchData]);

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    const tasks = [];
    if (screenName !== screen.name) {
      tasks.push(
        fetch(`${API_BASE_URL}/players/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: screenName }),
        })
      );
    }
    if (
      assignedContentId !==
      (screen.assignedContent?.contentId?._id || '')
    ) {
      tasks.push(
        fetch(`${API_BASE_URL}/players/${id}/assign`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contentType: 'Playlist',
            contentId: assignedContentId || null,
          }),
        })
      );
    }
    try {
      const responses = await Promise.all(tasks);
      for (const res of responses) {
        if (!res.ok) {
          const errorResult = await res.json();
          throw new Error(errorResult.message || 'One update failed.');
        }
      }
      toast.success('Changes saved successfully!'); // Show success toast
      fetchData();
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast.error(`Error: ${error.message}`); // Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  if (error) return <OfflineContent onRetry={fetchData} />; // Show OfflineContent when there's an error
  if (isLoading) return <LoadingSpinner />; // Show spinner while loading

  return (
    <div className="page-container">
      <MainHeader title={`Screen Editing - ${screen?.name || ''}`} />
      {screen && (
        <div className={styles.detailsLayout}>
          <div className={styles.previewColumn}>
            <h3 className={styles.columnTitle}>Preview</h3>
            <PlaylistPreview playlist={screen.assignedContent?.contentId} />
            <div className={styles.previewInfo}>
              <span>Now playing playlist:</span>
              <span className={styles.infoValue}>
                {screen.assignedContent?.contentId?.name || 'None'}
              </span>
            </div>
            <div className={styles.previewInfo}>
              <span>Online status:</span>
              <span
                className={styles.infoValue}
                style={{ color: onlineStatus.color }}
              >
                {onlineStatus.text}
              </span>
            </div>
          </div>
          <div className={styles.settingsColumn}>
            <h3 className={styles.columnTitle}>General settings</h3>
            <div className={styles.formCard}>
              <div className={styles.formGroup}>
                <label htmlFor="screen-name">Screen Name</label>
                <input
                  id="screen-name"
                  type="text"
                  className={styles.input}
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="assigned-playlist">Assigned Playlist</label>
                <select
                  id="assigned-playlist"
                  className={styles.input}
                  value={assignedContentId}
                  onChange={(e) => setAssignedContentId(e.target.value)}
                >
                  <option value="">No Playlist Assigned</option>
                  {playlists.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSaveChanges}
                className={styles.saveButton}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
  {/* ToastContainer is provided globally in App.jsx */}
    </div>
  );
};

export default ScreenDetailsPage;