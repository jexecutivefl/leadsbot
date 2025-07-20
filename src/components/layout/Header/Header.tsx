import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  isMenuOpen = false,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchValue);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const headerClasses = [
    styles.header,
    className
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} {...props}>
      <div className={styles.headerContainer}>
        {/* Left Section - Logo & Menu Toggle */}
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={onMenuToggle}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12h18M3 6h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <div className={styles.logo}>
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
            <span className={styles.logoText}>Leadsbot</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className={styles.headerCenter}>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <svg
                className={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search leads, contacts..."
                className={styles.searchInput}
                value={searchValue}
                onChange={handleSearchChange}
              />
              <kbd className={styles.searchShortcut}>⌘K</kbd>
            </div>
          </form>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className={styles.headerRight}>
          {/* Notifications */}
          <div className={styles.notificationWrapper}>
            <button
              type="button"
              className={styles.notificationButton}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Notifications"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.notificationBadge}>3</span>
            </button>

            {isNotificationsOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationHeader}>
                  <h3>Notifications</h3>
                  <button type="button" className={styles.markAllRead}>
                    Mark all read
                  </button>
                </div>
                <div className={styles.notificationList}>
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationContent}>
                      <p>New lead from website contact form</p>
                      <span className={styles.notificationTime}>2 min ago</span>
                    </div>
                  </div>
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationContent}>
                      <p>AI responded to John Smith inquiry</p>
                      <span className={styles.notificationTime}>5 min ago</span>
                    </div>
                  </div>
                  <div className={styles.notificationItem}>
                    <div className={styles.notificationContent}>
                      <p>Follow-up reminder: Contact Sarah Jones</p>
                      <span className={styles.notificationTime}>1 hour ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className={styles.profileWrapper}>
            <button
              type="button"
              className={styles.profileButton}
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              aria-label="User menu"
              aria-expanded={isProfileDropdownOpen}
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
                className={styles.profileAvatar}
              />
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>
                  {user?.signInDetails?.loginId || 'User'}
                </span>
                <span className={styles.profileRole}>Admin</span>
              </div>
              <svg
                className={styles.profileChevron}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isProfileDropdownOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileDropdownHeader}>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                    className={styles.profileDropdownAvatar}
                  />
                  <div>
                    <p className={styles.profileDropdownName}>
                      {user?.signInDetails?.loginId || 'User'}
                    </p>
                    <p className={styles.profileDropdownEmail}>
                      {user?.signInDetails?.loginId || 'user@example.com'}
                    </p>
                  </div>
                </div>
                <div className={styles.profileDropdownMenu}>
                  <a href="/settings/user" className={styles.profileDropdownItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Profile
                  </a>
                  <a href="/settings/system" className={styles.profileDropdownItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Settings
                  </a>
                  <div className={styles.profileDropdownDivider} />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={styles.profileDropdownItem}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;