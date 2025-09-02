import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
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
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="screens" element={<ScreensPage />} />
          <Route path="screens/:id" element={<ScreenDetailsPage />} />
          <Route path="playlists" element={<PlaylistsPage />} />
          <Route path="playlists/:id" element={<PlaylistDetailsPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="*" element={<div style={{padding: 40}}><h2>Page Not Found</h2></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;