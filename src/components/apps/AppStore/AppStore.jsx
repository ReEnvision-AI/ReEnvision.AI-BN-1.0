import React, { useEffect, useState } from 'react';
import { Search, Download, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { iconMap } from '../../utils/iconmap';

export function AppStore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [installing, setInstalling] = useState({});
  const { getUser } = useAuthStore();
  const {
    installableApps,
    installedApps,
    loading,
    error,
    fetchInstallableApps,
    fetchInstalledApps,
    installApp,
    uninstallApp,
  } = useAppStore();

  const categories = [
    { id: 'all', name: 'All Apps' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'development', name: 'Development' },
  ];

  useEffect(() => {
    const loadApps = async () => {
      try {
        await fetchInstallableApps();
        const user = getUser();
        if (user) {
          await fetchInstalledApps(user.id);
        }
      } catch (err) {
        console.error('Error loading apps:', err);
      }
    };

    loadApps();
  }, [fetchInstallableApps, fetchInstalledApps, getUser]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-xl">Error loading apps: {error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading apps...</div>
      </div>
    );
  }

  const filteredApps = installableApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = async (app) => {
    setInstalling((prev) => ({ ...prev, [app.id]: 'installing' }));
    installApp(getUser().id, app.id);
    setInstalling((prev) => ({ ...prev, [app.id]: 'success' }));
    setTimeout(() => {
      setInstalling((prev) => ({ ...prev, [app.id]: null }));
    }, 1000);
  };

  const handleUninstall = async (app) => {
    if (app.id === 'settings' || app.id === 'appstore') {
      alert('This app cannot be uninstalled');
      return;
    }

    setInstalling((prev) => ({ ...prev, [app.id]: 'uninstalling' }));
    uninstallApp(getUser().id, app.id);
    setInstalling((prev) => ({ ...prev, [app.id]: 'success' }));
    setTimeout(() => {
      setInstalling((prev) => ({ ...prev, [app.id]: null }));
    }, 1000);
  };

  const isAppInstalled = (app) => {
    if (installedApps) {
      return installedApps.find((item) => item.id === app.id);
    }
    return false;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none flex items-center gap-4 p-4 bg-gray-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search apps..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain p-4 scroll-smooth">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800/50 rounded-lg p-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {React.createElement(iconMap[app.icon] ? iconMap[app.icon] : iconMap.app, {
                    className: 'w-8 h-8 text-blue-400',
                  })}
                  <div>
                    <h3 className="text-lg font-medium text-white">{app.name}</h3>
                    <p className="text-sm text-gray-400">{app.category}</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => (isAppInstalled(app) ? handleUninstall(app) : handleInstall(app))}
                  disabled={installing[app.id]}
                  className={`
                      p-2 rounded-lg transition-colors relative min-w-touch min-h-touch
                      ${installing[app.id] ? 'cursor-not-allowed' : 'cursor-pointer'}
                      ${isAppInstalled(app) ? 'text-red-400 hover:bg-red-400/10' : 'text-blue-400 hover:bg-blue-400/10'}
                    `}
                >
                  <AnimatePresence mode="wait">
                    {installing[app.id] ? (
                      <motion.div
                        key="installing"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      </motion.div>
                    ) : isAppInstalled(app) ? (
                      <motion.div
                        key="uninstall"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="install"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <p className="text-sm text-gray-300 mb-4">{app.description}</p>
              {app.screenshots?.length > 0 && (
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  src={app.screenshots[0]}
                  alt={`${app.name} screenshot`}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              {installing[app.id] && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.5 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppStore;
