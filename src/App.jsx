import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Desktop } from './components/Desktop/Desktop';
import { TaskBar } from './components/TaskBar/TaskBar';
import { WindowManager } from './components/WindowManager';
import { AppContextProvider } from './context/AppContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [windows, setWindows] = useState([]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AppContextProvider>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
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