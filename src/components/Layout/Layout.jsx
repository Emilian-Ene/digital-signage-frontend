import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';
import { FiMenu } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Layout = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // ✅ This uses React.cloneElement to pass the isMobile prop to child pages
  const outletWithProps = React.Children.map(
    <Outlet />,
    child => React.cloneElement(child, { isMobile })
  );

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={styles.mainContent}>
        {isMobile && !isSidebarOpen && (
          <button onClick={toggleSidebar} className={styles.hamburgerButton}>
            <FiMenu />
          </button>
        )}
        {outletWithProps} {/* Render the outlet with the new props */}
      </div>
    </div>
  );
};

export default Layout;