// src/components/Sidebar/Sidebar.jsx

import React from "react";
import styles from "./Sidebar.module.css";
import {
  FiTv,
  FiList,
  FiImage,
  FiPenTool,
  FiGrid,
  FiCode,
  FiBriefcase,
  FiDollarSign,
  FiHelpCircle,
} from "react-icons/fi";

// --- Navigation Data (Moved here for clarity) ---
const mainNavLinks = [
  { icon: <FiTv />, text: "Screens" },
  { icon: <FiList />, text: "Playlists" },
  { icon: <FiImage />, text: "Media" },
  { icon: <FiPenTool />, text: "Scenes" },
  { icon: <FiGrid />, text: "Apps" },
  { icon: <FiCode />, text: "Integrations" },
];

const secondaryNavLinks = [
  { icon: <FiBriefcase />, text: "My Organization" },
  { icon: <FiDollarSign />, text: "Billing" },
  { icon: <FiHelpCircle />, text: "Documentation" },
];

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <a
          href="#"
          className={styles.logoLink}
          onClick={(e) => {
            e.preventDefault();
            setActivePage("Home");
          }}
        >
          <h1 className={styles.logo}>PixelFlow</h1>
        </a>
      </div>
      <nav className={styles.sidebarNav}>
        <div>
          {mainNavLinks.map((link) => (
            <a
              key={link.text}
              href="#"
              className={`${styles.navLink} ${
                activePage === link.text ? styles.active : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActivePage(link.text);
              }}
            >
              {link.icon}
              <span>{link.text}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <nav>
          {secondaryNavLinks.map((link) => (
            <a
              key={link.text}
              href="#"
              className={`${styles.navLink} ${
                activePage === link.text ? styles.active : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActivePage(link.text);
              }}
            >
              {link.icon}
              <span>{link.text}</span>
            </a>
          ))}
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>IE</div>
          <span className={styles.userEmail}>
            ionut.emilian@paragon-cc.co.uk
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
