import React, { useState, useEffect, Suspense } from 'react';
import { Desktop } from './components/Desktop/Desktop';
import { TaskBar } from './components/TaskBar/TaskBar';
import { WindowManager } from './components/WindowManager';
import { AppContextProvider } from './context/AppContext';
import { useUser } from './context/UserContext';
import { Toaster } from 'react-hot-toast';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { UserSettingsProvider } from './context/UserSettingsContext';
import supabase from './services/supabaseService';

function App() {
  const [windows, setWindows] = useState([]);
  const { user, setUser, clearUser } = useUser();

  useEffect(() => { 
    supabase.auth.getSession().then(({ data: { session } }) => {
      
      let u = {
        firstName: undefined,
        lastName: undefined,
        email: undefined
      }
      if (user?.email && user.email === session?.user?.email) {
        return;
      }

      u.email = session?.user.email;
      if(u.email) {
        setUser(u);
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      let u = {
        firstName: undefined,
        lastName: undefined,
        email: undefined
      }

      if (user?.email && user.email === session?.user?.email && session.expires_in > 0) {
        return;
      }

      u.email = session?.user.email;
      if(u.email) {
        setUser(u);
      }
    })

    return () => subscription.unsubscribe()
  });

  const handleLogout = () => {
    supabase.auth.signOut({scope: 'local'}).then(() => {
      setWindows([]);
      clearUser();
    }).catch((error) => {
      console.log(error);
    })
  }


  return (
    <AppContextProvider>
      {!user ? (
         <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google', ]}/>
      ) : (
        <div className="h-screen w-screen overflow-hidden bg-gray-900 flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <Suspense fallback={<></>}>
              <UserSettingsProvider>
                <Desktop windows={windows} setWindows={setWindows}>
                  <WindowManager windows={windows} setWindows={setWindows} />
                </Desktop>
              </UserSettingsProvider>
            </Suspense>
          </div>
          <TaskBar 
            windows={windows} 
            setWindows={setWindows} 
            onLogout={handleLogout}
          />
        </div>
      )}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
    </AppContextProvider>
  );
}

export default App;