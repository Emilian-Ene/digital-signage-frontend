// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import ScreensPage from './pages/ScreensPage';
import PlaylistsPage from './pages/PlaylistsPage';
import MediaPage from './pages/MediaPage'; 
import ScreenDetailsPage from './pages/ScreenDetailsPage';
import PlaylistDetailsPage from './pages/PlaylistDetailsPage';
// ✅ 1. Import the ToastContainer and its necessary CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SyncActivePage = ({ setActivePage }) => {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActivePage('Home');
    else if (path.startsWith('/screens')) setActivePage('Screens');
    else if (path.startsWith('/playlists')) setActivePage('Playlists');
    else if (path.startsWith('/media')) setActivePage('Media'); // <-- ADD THIS
    // ...
  }, [location, setActivePage]);
  return null;
};

function App() {
  const [activePage, setActivePage] = useState('Home');

  return (
    <BrowserRouter>
      {/* ✅ 2. Add the ToastContainer here. This component will render all your notifications. */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
  style={{ zIndex: 200000 }}
      />
      <SyncActivePage setActivePage={setActivePage} />
      <Routes>
        <Route path="/" element={<Layout activePage={activePage} setActivePage={setActivePage} />}>
          <Route index element={<HomePage />} />
          <Route path="screens" element={<ScreensPage />} />
          <Route path="screens/:id" element={<ScreenDetailsPage />} />
          <Route path="playlists" element={<PlaylistsPage />} />
          <Route path="media" element={<MediaPage />} /> {/* <-- 2. ADD THE ROUTE */}
          <Route path="*" element={<div style={{padding: 40}}><h2>Page Not Found</h2></div>} />
          <Route path="playlists/:id" element={<PlaylistDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;