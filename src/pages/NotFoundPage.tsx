import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.content}>
            <div className={styles.icon}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            
            <h1 className={styles.title}>Page Not Found</h1>
            
            <p className={styles.description}>
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className={styles.actions}>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                className={styles.button}
              >
                Go to Dashboard
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className={styles.button}
              >
                Go Back
              </Button>
            </div>
            
            <div className={styles.helpSection}>
              <h3 className={styles.helpTitle}>Need Help?</h3>
              <p className={styles.helpText}>
                Try navigating to one of these common pages:
              </p>
              
              <div className={styles.helpLinks}>
                <button
                  className={styles.helpLink}
                  onClick={() => navigate('/leads')}
                >
                  Leads Management
                </button>
                
                <button
                  className={styles.helpLink}
                  onClick={() => navigate('/analytics')}
                >
                  Analytics
                </button>
                
                <button
                  className={styles.helpLink}
                  onClick={() => navigate('/ai-chat')}
                >
                  AI Assistant
                </button>
                
                <button
                  className={styles.helpLink}
                  onClick={() => navigate('/settings/user')}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage; 