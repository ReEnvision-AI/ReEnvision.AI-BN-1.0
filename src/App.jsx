import React, { useEffect, useState, useCallback } from 'react';
import { Desktop } from './components/Desktop/Desktop';
import { AuthPage } from './components/Auth/AuthPage';
import { CheckoutPage } from './components/Auth/CheckoutPage';
import { useAuthStore } from './store/useAuthStore';
import supabase, { updateLastActivity } from './services/supabaseService';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ReturnPage } from './components/Return';
import { useAuthContext } from './context/AuthContext';
import { isSessionValid } from './services/supabaseService';

function App() {
  //const { user, setUser, loading, setLoading } = useAuthStore();
  const { user, setUser} = useAuthContext();
  const [configError, setConfigError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update last activity on user interaction
  const handleUserActivity = useCallback(() => {
    if (user) {
      updateLastActivity();
    }
  }, [user]);

  // Set up activity listeners
  useEffect(() => {
    if (user) {
      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);
      window.addEventListener('touchstart', handleUserActivity);
      window.addEventListener('scroll', handleUserActivity);

      return () => {
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        window.removeEventListener('touchstart', handleUserActivity);
        window.removeEventListener('scroll', handleUserActivity);
      };
    }
  }, [user, handleUserActivity]);

  // Initialize auth store
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  useEffect(() => {
    // Check if Supabase is properly configured
    console.log('Checking variables...');
    if (!import.meta.env.VITE_SUPA_URL || !import.meta.env.VITE_SUPA_PUBLIC_KEY) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    console.log('Checking active sessions...');
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session results:', session);
      if (session?.user && isSessionValid()) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', _event, session);
      if (session?.user && isSessionValid()) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-700">
            Supabase environment variables are not configured. Please add the following to your .env file:
          </p>
          <pre className="bg-gray-100 p-4 rounded mt-4 text-sm overflow-x-auto">
            VITE_SUPA_URL=your-project-url{'\n'}
            VITE_SUPA_PUBLIC_KEY=your-anon-key
          </pre>
          <p className="mt-4 text-gray-700">You can find these values in your Supabase project settings.</p>
        </div>
      </div>
    );
  }

  //return user ? <Desktop /> : <AuthPage />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Desktop/></ProtectedRoute>} />
        <Route path="/login" element={<AuthPage login={true}/>} />
        <Route path="/signup" element={<AuthPage login={false}/>} />
        <Route path="/return" element={<ReturnPage/>} />
        <Route path="/subscribe" element={user ? <CheckoutPage/> :<AuthPage login={false}/>} />
        <Route path="/desktop" element={<ProtectedRoute><Desktop/></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App;
