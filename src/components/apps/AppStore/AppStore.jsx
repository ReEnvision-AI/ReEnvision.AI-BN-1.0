import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, RefreshCw, Store, Package, Grid, Settings, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../../store/useAppStore';
import { AdminPanel } from './AdminPanel.jsx';
import { useAuthStore } from '../../../store/useAuthStore';
import { iconMap } from '../../utils/iconmap';

const AppStore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [showAdmin, setShowAdmin] = useState(false);
  const [installing, setInstalling] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const { getUser } = useAuthStore();
  const {
    categories = [],
    installableApps,
    installedApps,
    loading,
    error,
    fetchCategories,
    fetchInstallableApps,
    fetchInstalledApps,
    installApp,
    uninstallApp,
  } = useAppStore();

  useEffect(() => {
    const loadApps = async () => {
      try {
        await fetchCategories();
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
  }, [fetchInstallableApps, fetchInstalledApps, fetchCategories, getUser]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>Error loading apps: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-300">Loading apps...</div>
        </div>
      </div>
    );
  }

  const filteredApps = installableApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || selectedCategory === '1' || 
      app.category?.toLowerCase() === categories.find(c => c.id.toString() === selectedCategory)?.name.toLowerCase();
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
    <div className="h-full bg-gray-900 text-white">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className={`${showMenu ? 'fixed inset-0 z-50 bg-gray-900' : 'hidden md:flex'} w-64 border-r border-gray-800 flex-col`}>
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Store className="w-6 h-6" />
              App Store
            </h2>
            <button
              onClick={() => setShowMenu(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search apps..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-400 mt-6 mb-2 md:hidden"
            >
              <span>Categories</span>
              {isCategoriesExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <h3 className="text-sm font-medium text-gray-400 mb-2 hidden md:block">Categories</h3>
            <div className={`space-y-1 mb-4 ${isCategoriesExpanded || !showMenu ? 'block' : 'hidden md:block'}`}>
              {/* Categories list */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Grid className="w-4 h-4" />
                All Apps
              </button>
              {categories?.map((category) => (
                <button
                  key={`category-${category.id.toString()}`}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id.toString() ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                  }`} 
                >
                  <Grid className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>
            {/* Admin button */}
            <button
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors text-gray-300 hover:bg-gray-800 ${isCategoriesExpanded || !showMenu ? 'block' : 'hidden md:block'}`}
              onClick={() => setShowAdmin(true)}
              title="Admin Settings"
            >
              <Settings className="w-4 h-4" />
              Admin Panel
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 relative">
          {showAdmin ? (
            <AdminPanel onClose={() => setShowAdmin(false)} />
          ) : (
            <>
            <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <h2 className="text-xl font-medium text-white">
                Available Apps
                {selectedCategory !== 'all' && categories.find(c => c.id.toString() === selectedCategory) && (
                  <span className="text-sm text-gray-400 block md:inline-block md:ml-2">
                    • {categories.find(c => c.id.toString() === selectedCategory).name}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setShowMenu(true)}
                className="p-2 hover:bg-gray-800 rounded-lg md:hidden min-w-touch min-h-touch"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="grid gap-6 auto-rows-fr" style={{
                gridTemplateColumns: isMobile 
                  ? 'repeat(auto-fill, minmax(140px, 1fr))'
                  : 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))'
              }}>
                {filteredApps.map((app) => (
                  <motion.div
                    key={app.id}
                    layoutId={`app-layout-${app.id}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      bg-gray-800 rounded-lg border border-gray-700 flex flex-col
                      ${isMobile ? 'p-3' : 'p-6'}
                    `}
                  >
                    <div className={`flex items-start justify-between ${isMobile ? 'mb-2' : 'mb-4'}`}>
                      <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                        {React.createElement(iconMap[app.icon] ? iconMap[app.icon] : iconMap.app, {
                          className: `${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-blue-400`,
                        })}
                        <div>
                          <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-white`}>{app.name}</h3>
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400`}>{app.category}</p>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => (isAppInstalled(app) ? handleUninstall(app) : handleInstall(app))}
                        disabled={installing[app.id]}
                        className={`
                          ${isMobile ? 'p-1.5' : 'p-2'} rounded-lg transition-colors relative min-w-touch min-h-touch
                          ${installing[app.id] ? 'cursor-not-allowed' : 'cursor-pointer'}
                          ${isAppInstalled(app) ? 'text-red-400 hover:bg-red-400/10' : 'text-blue-400 hover:bg-blue-400/10'}
                        `}
                      >
                        <AnimatePresence mode="wait">
                          {installing[app.id] ? (
                            <motion.div
                              key={`status-installing-${app.id}-${Date.now()}`}
                              initial={{ opacity: 0, rotate: 0 }}
                              animate={{ opacity: 1, rotate: 360 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <RefreshCw className="w-5 h-5 animate-spin" />
                            </motion.div>
                          ) : isAppInstalled(app) ? (
                            <motion.div
                              key={`status-uninstall-${app.id}-${Date.now()}`}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key={`status-install-${app.id}-${Date.now()}`}
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
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-300 ${isMobile ? 'mb-2' : 'mb-4'} flex-grow line-clamp-2`}>
                      {app.description}
                    </p>
                    {Array.isArray(app.screenshots) && app.screenshots.length > 0 && (
                      <motion.img
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        src={app.screenshots[0] || ''}
                        alt={`${app.name} screenshot`}
                        className={`w-full ${isMobile ? 'h-24' : 'h-48'} object-cover rounded-lg bg-gray-900`}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=800&q=80';
                        }}
                        loading="lazy"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppStore