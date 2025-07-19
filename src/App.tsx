import { useState } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';

type CurrentPage = 'login' | 'dashboard';

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
              🎉 Phase 2 Complete!
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-primary-700)' }}>
              Layout with Sidebar, Login page, and Dashboard are now ready
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            View Login Page
          </button>
        </div>
      </div>
      
      {currentPage === 'dashboard' && <Dashboard />}
    </Layout>
  );
}

export default App;
