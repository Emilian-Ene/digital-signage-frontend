// src/pages/ScreenDetailsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader';
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

  const [screenName, setScreenName] = useState('');
  const [assignedContentId, setAssignedContentId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const hasChanges = screen ? (screenName !== screen.name) || (assignedContentId !== (screen.assignedContent?.contentId?._id || '')) : false;

  const fetchData = useCallback(async (isPoll = false) => {
    if (!isPoll) setIsLoading(true);
    if (error) setError(null);
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
      
      if (!hasChanges) {
          setScreenName(screenData.name || '');
          setAssignedContentId(screenData.assignedContent?.contentId?._id || '');
      }
    } catch (e) {
      console.error(e);
      if (!isPoll) setError(e.message);
    } finally {
      if (!isPoll) setIsLoading(false);
    }
  }, [id, playlists.length, hasChanges]);

  useEffect(() => {
    fetchData(false);
    const intervalId = setInterval(() => fetchData(true), 5000);
    return () => clearInterval(intervalId);
  }, [id, fetchData]);

  const handleSaveChanges = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    const tasks = [];
    if (screenName !== screen.name) {
      tasks.push(fetch(`${API_BASE_URL}/players/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: screenName }),
      }));
    }
    if (assignedContentId !== (screen.assignedContent?.contentId?._id || '')) {
      tasks.push(fetch(`${API_BASE_URL}/players/${id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: 'Playlist', contentId: assignedContentId || null }),
      }));
    }
    try {
      const responses = await Promise.all(tasks);
      for (const res of responses) {
        if (!res.ok) {
          const errorResult = await res.json();
          throw new Error(errorResult.message || 'One update failed.');
        }
      }
      alert('Changes saved successfully!');
      fetchData(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="loading-message" style={{padding: 40}}>Loading Screen Details...</p>;
  if (error) return <p className="error-message" style={{padding: 40}}>{error}</p>;
  if (!screen) return <p style={{padding: 40}}>Screen not found.</p>;

  const displayStatus = getDisplayStatus(screen);

  return (
    <div className="page-container">
      <MainHeader title={`Screen Editing - ${screen.name}`} />
      <div className={styles.detailsLayout}>
        <div className={styles.previewColumn}>
          <h3 className={styles.columnTitle}>Preview</h3>
          <div className={styles.previewBox}></div>
          <div className={styles.previewInfo}>
            <span>Now playing playlist:</span>
            <span className={styles.infoValue}>
              {screen.assignedContent?.contentId?.name || 'None'}
            </span>
          </div>
           <div className={styles.previewInfo}>
            <span>Online status:</span>
            <span className={styles.infoValue} style={{ color: displayStatus.color }}>
              {displayStatus.text}
            </span>
          </div>
        </div>
        <div className={styles.settingsColumn}>
          <h3 className={styles.columnTitle}>General settings</h3>
          <div className={styles.formCard}>
            <div className={styles.formGroup}>
              <label htmlFor="screen-name">Screen Name</label>
              <input 
                id="screen-name" type="text" className={styles.input}
                value={screenName}
                onChange={(e) => setScreenName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="assigned-playlist">Assigned Playlist</label>
              <select 
                id="assigned-playlist" className={styles.input}
                value={assignedContentId}
                onChange={(e) => setAssignedContentId(e.target.value)}
              >
                <option value="">-- No Playlist Assigned --</option>
                {playlists.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
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
    </div>
  );
};

export default ScreenDetailsPage;