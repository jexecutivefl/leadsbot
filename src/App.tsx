import { useState } from 'react';
import './App.css';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import LeadsPage from './pages/leads';

type CurrentPage = 'login' | 'dashboard' | 'leads';

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
          backgroundColor: 'var(--color-success-50)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-success-200)'
        }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--color-success-800)' }}>
              🚀 Phase 3 Complete!
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-success-700)' }}>
              Lead Management with Table, Cards, Search & Filtering ready
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 'dashboard' ? 'var(--color-success-600)' : 'var(--color-success-400)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('leads')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentPage === 'leads' ? 'var(--color-success-600)' : 'var(--color-success-400)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Leads
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--color-gray-600)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'leads' && <LeadsPage />}
    </Layout>
  );
}

export default App;
