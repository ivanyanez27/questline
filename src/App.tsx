import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { JourneysPage } from './pages/JourneysPage';
import { JourneyDetailPage } from './pages/JourneyDetailPage';
import { NewJourneyPage } from './pages/NewJourneyPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { JourneyProvider } from './contexts/JourneyContext';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      <Route 
        path="/journeys" 
        element={
          <RequireAuth>
            <JourneysPage />
          </RequireAuth>
        } 
      />
      
      <Route 
        path="/journey/:id" 
        element={
          <RequireAuth>
            <JourneyDetailPage />
          </RequireAuth>
        } 
      />
      
      <Route 
        path="/new-journey" 
        element={
          <RequireAuth>
            <NewJourneyPage />
          </RequireAuth>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <JourneyProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <AppRoutes />
            </main>
            <Toaster position="top-right" />
          </div>
        </JourneyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;