import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Desktop } from './components/Desktop/Desktop';
import { TaskBar } from './components/TaskBar/TaskBar';
import { WindowManager } from './components/WindowManager';
import { AppContextProvider } from './context/AppContext';
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient('https://gmeujceuwsdpsvcpytnv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZXVqY2V1d3NkcHN2Y3B5dG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNDE3MzUsImV4cCI6MjA0NTgxNzczNX0.Sewmt744-ZbU-Ww4KIamIdldLULw1DrSbJkdlayhS5g')

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [windows, setWindows] = useState([]);

  /** 
  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        const user = localStorage.getItem('user');
        
        if (!currentUser || !user) {
          handleLogout();
          return;
        }

        const storedUser = JSON.parse(user);
        const { username } = JSON.parse(currentUser);

        if (username === storedUser.username) {
          setIsLoggedIn(true);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);


  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setWindows([]);
  };
*/
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = () => {
    supabase.auth.signOut({scope: 'local'}).then(() => { setWindows([])}).catch((error) => {
      console.log(error);
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AppContextProvider>
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google', ]}/>
      ) : (
        <div className="h-screen w-screen overflow-hidden bg-gray-900 flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <Desktop windows={windows} setWindows={setWindows}>
              <WindowManager windows={windows} setWindows={setWindows} />
            </Desktop>
          </div>
          <TaskBar 
            windows={windows} 
            setWindows={setWindows} 
            onLogout={handleLogout}
          />
        </div>
      )}
    </AppContextProvider>
  );
}

export default App;