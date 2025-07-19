import { useState } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import LeadsPage from './pages/leads';
import UserSettings from './pages/settings/UserSettings';
import SystemSettings from './pages/settings/SystemSettings';

type CurrentPage = 'login' | 'dashboard' | 'leads' | 'user-settings' | 'system-settings';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // Show login page if not authenticated
  if (!isAuthenticated || currentPage === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  // Show main application with layout
  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: 'var(--color-primary-50)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-primary-200)'
        }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-primary-800)' }}>
              🤖 Phase 4 Complete!
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-primary-700)' }}>
              AI Integration & Settings - Chat Interface, AI Configuration & System Settings
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 'dashboard' ? 'var(--color-primary-600)' : 'var(--color-primary-400)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('leads')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 'leads' ? 'var(--color-primary-600)' : 'var(--color-primary-400)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Leads
            </button>
            <button
              onClick={() => setCurrentPage('user-settings')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 'user-settings' ? 'var(--color-primary-600)' : 'var(--color-primary-400)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              User Settings
            </button>
            <button
              onClick={() => setCurrentPage('system-settings')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 'system-settings' ? 'var(--color-primary-600)' : 'var(--color-primary-400)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              System Settings
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-gray-600)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'leads' && <LeadsPage />}
      {currentPage === 'user-settings' && <UserSettings />}
      {currentPage === 'system-settings' && <SystemSettings />}
    </Layout>
  );
}

export default App;
