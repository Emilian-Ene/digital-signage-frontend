// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import styles from './Sidebar.module.css';
import { Link } from 'react-router-dom';
import { 
  FiTv, FiList, FiImage, FiPenTool, FiGrid, FiCode,
  FiBriefcase, FiDollarSign, FiHelpCircle 
} from 'react-icons/fi';

const mainNavLinks = [
  { icon: <FiTv />, text: 'Screens', path: '/screens' },
  { icon: <FiList />, text: 'Playlists', path: '/playlists' },
  { icon: <FiImage />, text: 'Media', path: '/media' },
  { icon: <FiPenTool />, text: 'Scenes', path: '/scenes' },
  { icon: <FiGrid />, text: 'Apps', path: '/apps' },
  { icon: <FiCode />, text: 'Integrations', path: '/integrations' },
];

const secondaryNavLinks = [
  { icon: <FiBriefcase />, text: 'My Organization', path: '/organization' },
  { icon: <FiDollarSign />, text: 'Billing', path: '/billing' },
  { icon: <FiHelpCircle />, text: 'Documentation', path: '/docs' },
];

// --- THE FIX IS HERE: Add setActivePage as a prop ---
const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        {/* --- ADD onClick HERE --- */}
        <Link to="/" className={styles.logoLink} onClick={() => setActivePage('Home')}>
          <h1 className={styles.logo}>PixelFlow</h1>
        </Link>
      </div>
      <nav className={styles.sidebarNav}>
        <div>
          {mainNavLinks.map(link => (
            <Link
              key={link.text}
              to={link.path}
              className={`${styles.navLink} ${activePage === link.text ? styles.active : ''}`}
              // --- ADD onClick HERE ---
              onClick={() => setActivePage(link.text)}
            >
              {link.icon}
              <span>{link.text}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <nav>
          {secondaryNavLinks.map(link => (
             <Link
              key={link.text}
              to={link.path}
              className={`${styles.navLink} ${activePage === link.text ? styles.active : ''}`}
              // --- ADD onClick HERE ---
              onClick={() => setActivePage(link.text)}
            >
              {link.icon}
              <span>{link.text}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>IE</div>
          <span className={styles.userEmail}>ionut.emilian@paragon-cc.co.uk</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;