import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import Header from '../Header';
import Sidebar from '../Sidebar';

interface LayoutProps {
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  className = '',
  ...props
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On desktop, sidebar should be open by default
      // On mobile, sidebar should be closed by default
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      } else if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isSidebarOpen]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const layoutClasses = [
    styles.layout,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses} {...props}>
      {/* Header */}
      <Header
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isSidebarOpen}
        className={styles.header}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        className={styles.sidebar}
        data-open={isSidebarOpen}
      />

      {/* Main Content */}
      <main 
        className={styles.main}
        data-sidebar-closed={!isSidebarOpen}
      >
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay for sidebar */}
      {isMobile && isSidebarOpen && (
        <div 
          className={styles.mobileOverlay} 
          onClick={handleSidebarClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Layout;