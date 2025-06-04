import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { JourneysPage } from './pages/JourneysPage';
import { JourneyDetailPage } from './pages/JourneyDetailPage';
import { NewJourneyPage } from './pages/NewJourneyPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { JourneyProvider } from './contexts/JourneyContext';
import { ThemeProvider } from './contexts/ThemeContext';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-bg-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
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

      <Route 
        path="/achievements" 
        element={
          <RequireAuth>
            <AchievementsPage />
          </RequireAuth>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <JourneyProvider>
            <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary dark:text-white transition-colors duration-200">
              <Navbar />
              <main>
                <AppRoutes />
              </main>
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: 'dark:bg-bg-card-dark dark:text-white',
                }} 
              />
            </div>
          </JourneyProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;