import React from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, FiList, FiFilm, FiBox, FiLayers, FiGitMerge, 
  FiBriefcase, FiCreditCard, FiHelpCircle, FiX 
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarClass = isOpen ? styles.sidebar : `${styles.sidebar} ${styles.closed}`;

  return (
    <nav className={sidebarClass}>
      <div>
        <div className={styles.sidebarHeader}>
          <NavLink to="/" className={styles.logoLink} end>
            <div className={styles.logo}>PixelFlow</div>
          </NavLink>
          <button onClick={toggleSidebar} className={styles.closeButton}>
            <FiX />
          </button>
        </div>
        <div className={styles.menu}>
          <NavLink to="/screens" className={styles.menuItem} end><FiGrid /> Screens</NavLink>
          <NavLink to="/playlists" className={styles.menuItem} end><FiList /> Playlists</NavLink>
          <NavLink to="/media" className={styles.menuItem} end><FiFilm /> Media</NavLink>
          <NavLink to="/scenes" className={styles.menuItem} end><FiBox /> Scenes</NavLink>
          <NavLink to="/apps" className={styles.menuItem} end><FiLayers /> Apps</NavLink>
          {/* ✅ CORRECTED: Changed 'menuitem' to 'menuItem' */}
          <NavLink to="/integrations" className={styles.menuItem} end><FiGitMerge /> Integrations</NavLink>
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.menu}>
          <NavLink to="/organization" className={styles.menuItem} end><FiBriefcase /> My Organization</NavLink>
          <NavLink to="/billing" className={styles.menuItem} end><FiCreditCard /> Billing</NavLink>
          <NavLink to="/documentation" className={styles.menuItem} end><FiHelpCircle /> Documentation</NavLink>
        </div>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>IE</div>
          <span className={styles.userEmail}>ionut.emilian@paragon-cc.co.uk</span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;