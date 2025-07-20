import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Login } from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFoundPage from './pages/NotFoundPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const LeadsPage = lazy(() => import('./pages/leads/LeadsPage'))
const LeadDetailPage = lazy(() => import('./pages/leads/LeadDetailPage'))
const NewLeadPage = lazy(() => import('./pages/leads/NewLeadPage'))
const QualifiedLeadsPage = lazy(() => import('./pages/leads/QualifiedLeadsPage'))
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'))
const AIChatPage = lazy(() => import('./pages/ai-chat/AIChatPage'))
const UserSettings = lazy(() => import('./pages/settings/UserSettings'))
const SystemSettings = lazy(() => import('./pages/settings/SystemSettings'))

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '1.2rem',
    color: 'var(--color-gray-600)'
  }}>
    <div>Loading...</div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Dashboard />
                  </Suspense>
                } />
                <Route path="leads" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LeadsPage />
                  </Suspense>
                } />
                <Route path="leads/:id" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <LeadDetailPage />
                  </Suspense>
                } />
                <Route path="leads/new" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NewLeadPage />
                  </Suspense>
                } />
                <Route path="leads/qualified" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <QualifiedLeadsPage />
                  </Suspense>
                } />
                <Route path="analytics" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AnalyticsPage />
                  </Suspense>
                } />
                <Route path="ai-chat" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AIChatPage />
                  </Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <UserSettings />
                  </Suspense>
                } />
                <Route path="settings/system" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <SystemSettings />
                  </Suspense>
                } />
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
