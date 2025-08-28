// src/components/Layout/Layout.jsx

import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

const Layout = ({ activePage, setActivePage }) => {
  return (
    <div className={styles.appLayout}>
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />
      <main className={styles.pageContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;