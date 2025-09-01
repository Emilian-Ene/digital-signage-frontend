// src/pages/ScreensPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import MainHeader from "../components/MainHeader/MainHeader";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal/DeleteConfirmModal";
import OfflineContent from "../components/OfflineContent/OfflineContent";
import ScreenPreviewModal from "../components/ScreenPreviewModal/ScreenPreviewModal";
import styles from './ScreensPage.module.css'; // ✅ ADD THIS LINE

const API_BASE_URL = "http://localhost:3000/api";
const SCREENS_CACHE_KEY = "pixelFlowScreensCacheWithStatus";

const getDisplayStatus = (player) => {
  if (!player || !player.lastHeartbeat)
    return { text: "Offline", className: "offline" };
  const lastHeartbeat = new Date(player.lastHeartbeat);
  const now = new Date();
  if (isNaN(lastHeartbeat.getTime()))
    return { text: "Offline", className: "offline" };
  const diffInSeconds = (now - lastHeartbeat) / 1000;
  return diffInSeconds <= 35
    ? { text: "Online", className: "online" }
    : { text: "Offline", className: "offline" };
};

const ScreensPage = () => {
  const [screens, setScreens] = useState(() => {
    try {
      const cachedScreens = localStorage.getItem(SCREENS_CACHE_KEY);
      return cachedScreens ? JSON.parse(cachedScreens) : [];
    } catch (error) {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState(null);

  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [screenToPreview, setScreenToPreview] = useState(null);

  const fetchScreens = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/players`);
      if (!response.ok) throw new Error("Could not connect to the server.");
      const allPlayers = await response.json();
      const visiblePlayers = allPlayers.filter(
        (player) => player.status !== "unpaired"
      );
      const screensWithStatus = visiblePlayers.map((player) => ({
        ...player,
        displayStatus: getDisplayStatus(player),
      }));
      setScreens(screensWithStatus);
      localStorage.setItem(
        SCREENS_CACHE_KEY,
        JSON.stringify(screensWithStatus)
      );
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScreens(false);
    const intervalId = setInterval(() => fetchScreens(true), 5000);
    return () => clearInterval(intervalId);
  }, [fetchScreens]);

  const handlePreviewClick = (screen) => {
    setScreenToPreview(screen);
    setPreviewModalOpen(true);
  };

  const showDeleteConfirmation = (id, name) => {
    setScreenToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handlePerformDelete = async () => {
    if (!screenToDelete) return;
    try {
      await fetch(`${API_BASE_URL}/players/${screenToDelete.id}`, {
        method: "DELETE",
      });
      setDeleteModalOpen(false);
      setScreenToDelete(null);
      fetchScreens(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const renderContent = () => {
    if (isLoading) return <p className="loading-message" style={{padding: '24px'}}>Loading screens...</p>;
    if (error) return <OfflineContent onRetry={() => fetchScreens(false)} />;
    if (screens.length === 0)
      return <p className="empty-message" style={{padding: '24px'}}>No paired screens found.</p>;

    // ✅ APPLY THE GRID STYLE HERE
    return (
        <div className={styles.screenGrid}> 
            {screens.map((player) => (
                <PlayerCard
                    key={player._id}
                    player={player}
                    onDeleteClick={() => showDeleteConfirmation(player._id, player.name)}
                    onPreviewClick={() => handlePreviewClick(player)}
                />
            ))}
        </div>
    );
  };

  return (
    <div className="page-container">
      <MainHeader title="Screens" />
      {/* The list-container class is no longer needed, as the grid is inside renderContent */}
      {renderContent()}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handlePerformDelete}
        screenName={screenToDelete?.name}
      />
      <ScreenPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        screen={screenToPreview}
      />
    </div>
  );
};

export default ScreensPage;