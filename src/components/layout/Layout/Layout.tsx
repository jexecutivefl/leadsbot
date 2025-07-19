import React, { useState, useEffect } from 'react';
import styles from './Layout.module.css';
import Header from '../Header';
import Sidebar from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  ...props
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On desktop, sidebar should be open by default
      // On mobile, sidebar should be closed by default
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    isSidebarOpen && !isMobile ? styles.layoutWithSidebar : '',
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
      />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.mainContent}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;