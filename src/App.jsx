// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import ScreensPage from './pages/ScreensPage';
import PlaylistsPage from './pages/PlaylistsPage'; // <-- THE TYPO WAS HERE
import ScreenDetailsPage from './pages/ScreenDetailsPage';

// Helper component to keep the sidebar's active link in sync with the URL
const SyncActivePage = ({ setActivePage }) => {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActivePage('Home');
    } else if (path.startsWith('/screens')) {
      setActivePage('Screens');
    } else if (path.startsWith('/playlists')) {
      setActivePage('Playlists');
    }
  }, [location, setActivePage]);
  return null;
};

function App() {
  const [activePage, setActivePage] = useState('Home');

  return (
    <BrowserRouter>
      <SyncActivePage setActivePage={setActivePage} />
      <Routes>
        <Route path="/" element={<Layout activePage={activePage} setActivePage={setActivePage} />}>
          <Route index element={<HomePage />} />
          <Route path="screens" element={<ScreensPage />} />
          <Route path="screens/:id" element={<ScreenDetailsPage />} />
          <Route path="playlists" element={<PlaylistsPage />} />
          <Route path="*" element={<div style={{padding: 40}}><h2>Page Not Found</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;