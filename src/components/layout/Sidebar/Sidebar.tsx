import React, { useState } from 'react';
import styles from './Sidebar.module.css';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavigationItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  className = '',
  ...props
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);
  const [activeItem, setActiveItem] = useState('dashboard');

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
        </svg>
      ),
    },
    {
      id: 'leads',
      label: 'Leads',
      path: '/leads',
      badge: 12,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      children: [
        {
          id: 'all-leads',
          label: 'All Leads',
          path: '/leads',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ),
        },
        {
          id: 'new-leads',
          label: 'New Leads',
          path: '/leads/new',
          badge: 5,
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          ),
        },
        {
          id: 'qualified-leads',
          label: 'Qualified',
          path: '/leads/qualified',
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ),
        },
      ],
    },
    {
      id: 'ai-chat',
      label: 'AI Assistant',
      path: '/ai-chat',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="9" r="1" fill="currentColor"/>
          <circle cx="15" cy="9" r="1" fill="currentColor"/>
          <path d="M9 13s1 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = (item: NavigationItem) => {
    setActiveItem(item.id);
    console.log(`Navigate to: ${item.path}`);
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = activeItem === item.id;
    const isExpanded = expandedSections.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className={styles.navigationItem}>
        <button
          className={`${styles.navigationButton} ${isActive ? styles.navigationButtonActive : ''} ${level > 0 ? styles.navigationButtonChild : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              handleItemClick(item);
            }
          }}
          aria-expanded={hasChildren ? isExpanded : undefined}
        >
          <div className={styles.navigationButtonContent}>
            <span className={styles.navigationIcon}>{item.icon}</span>
            <span className={styles.navigationLabel}>{item.label}</span>
            {item.badge && (
              <span className={styles.navigationBadge}>{item.badge}</span>
            )}
          </div>
          {hasChildren && (
            <svg
              className={`${styles.navigationChevron} ${isExpanded ? styles.navigationChevronExpanded : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        
        {hasChildren && (
          <div className={`${styles.navigationChildren} ${isExpanded ? styles.navigationChildrenExpanded : ''}`}>
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarClasses = [
    styles.sidebar,
    isOpen ? styles.sidebarOpen : styles.sidebarClosed,
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <aside className={sidebarClasses} {...props}>
        <div className={styles.sidebarContent}>
          {/* Sidebar Header */}
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarLogo}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32"
                  height="32"
                  rx="8"
                  fill="var(--color-primary-600)"
                />
                <path
                  d="M8 12h16M8 8h16M8 16h12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className={styles.sidebarLogoText}>Leadsbot</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className={styles.navigation}>
            <div className={styles.navigationSection}>
              {navigationItems.map(item => renderNavigationItem(item))}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className={styles.sidebarFooter}>
            <div className={styles.userProfile}>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
                className={styles.userAvatar}
              />
              <div className={styles.userInfo}>
                <span className={styles.userName}>John Doe</span>
                <span className={styles.userRole}>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;