// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import styles from './Sidebar.module.css';
import { Link } from 'react-router-dom';
import {
  HiOutlineDesktopComputer, HiOutlineViewList, HiOutlinePhotograph,
  HiOutlineSparkles, HiOutlineViewGrid, HiOutlinePuzzle,
  HiOutlineOfficeBuilding, HiOutlineCurrencyDollar, HiOutlineQuestionMarkCircle
} from 'react-icons/hi';

const mainNavLinks = [
  { icon: <HiOutlineDesktopComputer size={24} />, text: 'Screens', path: '/screens' },
  { icon: <HiOutlineViewList size={24} />, text: 'Playlists', path: '/playlists' },
  { icon: <HiOutlinePhotograph size={24} />, text: 'Media', path: '/media' },
  { icon: <HiOutlineSparkles size={24} />, text: 'Scenes', path: '/scenes' },
  { icon: <HiOutlineViewGrid size={24} />, text: 'Apps', path: '/apps' },
  { icon: <HiOutlinePuzzle size={24} />, text: 'Integrations', path: '/integrations' },
];

const secondaryNavLinks = [
  { icon: <HiOutlineOfficeBuilding size={24} />, text: 'My Organization', path: '/organization' },
  { icon: <HiOutlineCurrencyDollar size={24} />, text: 'Billing', path: '/billing' },
  { icon: <HiOutlineQuestionMarkCircle size={24} />, text: 'Documentation', path: '/docs' },
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
              <span className={styles.navIcon}>{link.icon}</span>
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