import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Lock, Plus, Trash2, X, Upload, Image, HelpCircle, Info, AlertCircle, Archive, ShieldAlert, Loader2 } from 'lucide-react'; // Added ShieldAlert, Loader2
import supabase from '../../../services/supabaseService';
import { useAuthContext } from '../../../context/AuthContext'; // Import useAuthContext

export function AdminPanel({ onClose }) {
  const { user } = useAuthContext(); // Get user from context
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(true); // State for checking admin status
  const [isAdminVerified, setIsAdminVerified] = useState(false); // State for verification result
  const [error, setError] = useState('');
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingApp, setEditingApp] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [filterTier, setFilterTier] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    icon: '',
    url: '',
    tier: 'base',
    category_ids: [],
    preferred_width: 800,
    preferred_height: 600,
    min_width: 400,
    min_height: 300,
    screenshots: []
  });

  // Effect to verify admin status via RPC call after user is loaded
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user) {
        setIsVerifyingAdmin(false);
        setIsAdminVerified(false);
        return;
      }

      setIsVerifyingAdmin(true);
      setError(''); // Clear previous errors

      try {
        // Call the is_admin function in Supabase.
        // Assumes the function uses auth.uid() internally (SECURITY DEFINER).
        // If it requires a user_id parameter, adjust the call like:
        // supabase.rpc('is_admin', { user_id_to_check: user.id })
        const { data, error: rpcError } = await supabase.rpc('is_admin');

        if (rpcError) {
          console.error('Error calling is_admin RPC:', rpcError);
          throw new Error(`Failed to verify admin status: ${rpcError.message}`);
        }

        console.log('is_admin RPC result:', data); // Log the result
        setIsAdminVerified(!!data); // Set verified status based on RPC result (true if data is truthy)

      } catch (err) {
        console.error('Admin verification failed:', err);
        setError(err.message || 'Failed to verify admin status.');
        setIsAdminVerified(false);
      } finally {
        setIsVerifyingAdmin(false);
      }
    };

    verifyAdminStatus();
  }, [user]); // Re-run when user changes

  // Effect to fetch data only if admin status is verified
  useEffect(() => {
    if (isAdminVerified) {
      fetchApps();
      fetchCategories();
    }
  }, [isAdminVerified]); // Re-run when admin verification status changes

  const fetchApps = async () => {
    setError('');
    const { data: appsData, error: appsError } = await supabase
      .from('app_categories_view')
      .select('*');

    if (appsError) {
      console.error('Error fetching apps:', appsError);
      setError('Failed to fetch apps');
      return;
    }

    const processedApps = appsData?.map(app => ({
      ...app,
      id: app.app_id,
      screenshots: app.screenshots || [],
      category_ids: app.category_ids || [],
      category_names: app.category_names || []
    })) || [];

    setApps(processedApps);
  };

  const fetchCategories = async () => {
    setError('');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id');

    if (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
      return;
    }

    setCategories(data);
  };

  // --- Handlers (handleSave, handleDelete, etc.) ---
  // Add checks within handlers to ensure isAdminVerified is true before proceeding

  const handleSave = async () => {
    if (!isAdminVerified) return; // Ensure user is verified admin
    // ... rest of handleSave logic
    try {
      const { error } = await supabase
        .from('installable_apps')
        .upsert({
          ...selectedApp,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      const { error: catError } = await supabase
        .from('app_categories')
        .delete()
        .eq('app_id', selectedApp.id);

      if (catError) throw catError;

      if (selectedApp.category_ids?.length) {
        const categoryInserts = selectedApp.category_ids.map(catId => ({
          app_id: selectedApp.id,
          category_id: catId
        }));

        const { error: insertError } = await supabase
          .from('app_categories')
          .insert(categoryInserts);

        if (insertError) throw insertError;
      }

      await fetchApps();
      setSelectedApp(null);
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  const handleDelete = async (appId) => {
    if (!isAdminVerified) return; // Ensure user is verified admin
    // ... rest of handleDelete logic
     try {
      const { error } = await supabase
        .from('installable_apps')
        .delete()
        .eq('id', appId);

      if (error) throw error;
      await fetchApps();
    } catch (err) {
      setError('Failed to delete app');
    }
  };

  const handleCreate = async () => {
    if (!isAdminVerified) return; // Ensure user is verified admin
    // ... rest of handleCreate logic
    try {
      if (!newApp.name || !newApp.icon || !newApp.url) {
        setError('Name, icon, and URL are required');
        return;
      }
      const screenshots = newApp.screenshots || [];
      const { data, error } = await supabase
        .from('installable_apps')
        .insert([{
          name: newApp.name,
          description: newApp.description,
          icon: newApp.icon,
          url: newApp.url,
          tier: newApp.tier,
          preferred_width: newApp.preferred_width,
          preferred_height: newApp.preferred_height,
          min_width: newApp.min_width,
          min_height: newApp.min_height,
          screenshots: screenshots
        }])
        .select()
        .single();

      if (error) throw error;

      if (newApp.category_ids?.length) {
        const categoryInserts = newApp.category_ids.map(catId => ({
          app_id: data.id,
          category_id: catId
        }));
        const { error: catError } = await supabase
          .from('app_categories')
          .insert(categoryInserts);
        if (catError) throw catError;
      }

      await fetchApps();
      setNewApp({
        name: '', description: '', icon: '', url: '', tier: 'base',
        category_ids: [], preferred_width: 800, preferred_height: 600,
        min_width: 400, min_height: 300, screenshots: []
      });
    } catch (err) {
      console.error('Error creating app:', err);
      setError('Failed to create app');
    }
  };

  const handleEdit = (app) => {
    if (!isAdminVerified) return; // Ensure user is verified admin
    setEditingApp({
      ...app,
      category_ids: app.category_ids || []
    });
  };

  const handleUpdate = async () => {
    if (!isAdminVerified) return; // Ensure user is verified admin
    // ... rest of handleUpdate logic
    try {
      if (!editingApp.name || !editingApp.icon || !editingApp.url) {
        setError('Name, icon, and URL are required');
        return;
      }
      const screenshots = editingApp.screenshots || [];
      const { error } = await supabase
        .from('installable_apps')
        .update({
          name: editingApp.name, description: editingApp.description, icon: editingApp.icon,
          url: editingApp.url, tier: editingApp.tier, preferred_width: editingApp.preferred_width,
          preferred_height: editingApp.preferred_height, min_width: editingApp.min_width,
          min_height: editingApp.min_height, screenshots: screenshots
        })
        .eq('id', editingApp.id);
      if (error) throw error;
      
      const { error: deleteError } = await supabase
        .from('app_categories')
        .delete()
        .eq('app_id', editingApp.id);
      if (deleteError) throw deleteError;

      if (editingApp.category_ids?.length) {
        const categoryInserts = editingApp.category_ids.map(catId => ({
          app_id: editingApp.id, category_id: catId
        }));
        const { error: insertError } = await supabase
          .from('app_categories')
          .insert(categoryInserts);
        if (insertError) throw insertError;
      }

      await fetchApps();
      setEditingApp(null);
    } catch (err) {
      setError('Failed to update app');
    }
  };

  const handleScreenshotUpload = async (e, app) => {
    if (!isAdminVerified) return; // Ensure user is verified admin
    // ... rest of handleScreenshotUpload logic
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB'); return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    setUploadingScreenshot(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('screenshots')
        .upload(`app-${app.id}/${fileName}`, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(`app-${app.id}/${fileName}`);
      const updatedApp = { ...app, screenshots: [...(app.screenshots || []), publicUrl] };
      const { error: updateError } = await supabase
        .from('installable_apps')
        .update({ screenshots: updatedApp.screenshots })
        .eq('id', app.id);
      if (updateError) throw updateError;
      await fetchApps();
    } catch (err) {
      setError('Failed to upload screenshot');
    } finally {
      setUploadingScreenshot(false);
      setPreviewUrl('');
    }
  };

  const handleRemoveScreenshot = async (app, screenshotUrl) => {
    if (!isAdminVerified) return; // Ensure user is verified admin
    // ... rest of handleRemoveScreenshot logic
    try {
      const updatedScreenshots = (app.screenshots || []).filter(url => url !== screenshotUrl);
      const { error } = await supabase
        .from('installable_apps')
        .update({ screenshots: updatedScreenshots })
        .eq('id', app.id);
      if (error) throw error;
      await fetchApps();
    } catch (err) {
      setError('Failed to remove screenshot');
    }
  };

  // Placeholder functions
  const handleCreateFolder = () => { if (!isAdminVerified) return; console.log("Create folder action triggered"); };
  const handleBulkAction = (action) => { if (!isAdminVerified) return; console.log(`Bulk action triggered: ${action}`); };

  // --- Conditional Rendering based on Verification Status ---

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-400">
        Please log in to access the admin panel.
      </div>
    );
  }

  if (isVerifyingAdmin) {
    return (
      <div className="p-6 flex items-center justify-center text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Verifying admin status...
      </div>
    );
  }

  if (!isAdminVerified) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">Access Denied</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto text-center">
          <p className="text-gray-300">You do not have permission to access this admin panel.</p>
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Render Admin Panel Content (User is Verified Admin) ---
  return (
    <div className="h-full flex flex-col overflow-hidden p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">App Store Administration</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
            title="Show Admin Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Admin Guidelines */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-400 mb-2">Admin Guidelines</h3>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>App names should be clear and descriptive</li>
              <li>Icons must use valid Lucide icon names (lowercase, hyphens only)</li>
              <li>URLs must start with http:// or https://</li>
              <li>Screenshots must be valid image URLs (jpg, png, gif, webp)</li>
              <li>Dimensions must follow min/preferred constraints</li>
              <li>Categories help users find apps more easily</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showArchived ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            Show Archived
          </button>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-gray-800 text-gray-300 rounded-lg px-3 py-1.5 text-sm border border-gray-700"
          >
            <option value="">All Tiers</option>
            <option value="base">Base</option>
            <option value="enterprise">Enterprise</option>
            <option value="community">Community</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* App List Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-blue-500/20">
            <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleCreateFolder}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-300"
              >
                <Plus className="w-4 h-4" />
                Add New App
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300"
              >
                <Archive className="w-4 h-4" />
                Archive Selected
              </button>
            </div>
          </div>

          {/* New App Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
          >
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New App
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newApp.name}
                  onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  placeholder="App Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newApp.description}
                  onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  placeholder="App Description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
                <select
                  value={newApp.tier}
                  onChange={(e) => setNewApp({ ...newApp, tier: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                >
                  <option value="base">Base</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <input
                  type="text"
                  placeholder="e.g., calculator, file-text, settings"
                  value={newApp.icon}
                  onChange={(e) => setNewApp({ ...newApp, icon: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Use icon names from Lucide React library (lowercase with hyphens)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Width</label>
                  <input
                    type="number"
                    value={newApp.preferred_width}
                    onChange={(e) => setNewApp({ ...newApp, preferred_width: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Height</label>
                  <input
                    type="number"
                    value={newApp.preferred_height}
                    onChange={(e) => setNewApp({ ...newApp, preferred_height: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Width</label>
                  <input
                    type="number"
                    value={newApp.min_width}
                    onChange={(e) => setNewApp({ ...newApp, min_width: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Min Height</label>
                  <input
                    type="number"
                    value={newApp.min_height}
                    onChange={(e) => setNewApp({ ...newApp, min_height: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/app"
                  value={newApp.url}
                  onChange={(e) => setNewApp({ ...newApp, url: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Must be a valid HTTPS URL where the app is hosted
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                <select
                  multiple
                  value={newApp.category_ids || []}
                  onChange={(e) => setNewApp({
                    ...newApp,
                    category_ids: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} (ID: {cat.id})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  Hold Ctrl/Cmd to select multiple categories
                </p>
              </div>

              <button
                onClick={handleCreate}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create App
              </button>
            </div>
          </motion.div>

          {/* Existing Apps */}
          {apps.map(app => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">{app.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(app)}
                    className="p-2 hover:bg-blue-500/20 rounded-lg"
                  >
                    <Pencil className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">
                  <span className="font-medium">URL:</span> {app.url}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-medium">Description:</span> {app.description}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-medium">Tier:</span> {app.tier}
                </div>
                
                {/* Screenshots Section */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Screenshots
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {app.screenshots?.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <div className="relative">
                          <img
                            src={screenshot}
                            alt={`${app.name} screenshot ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveScreenshot(app, screenshot)}
                            className="absolute top-1 right-1 p-1.5 bg-red-500/90 hover:bg-red-600/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Remove screenshot"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      title="Upload Screenshot"
                      accept="image/*"
                      onChange={(e) => handleScreenshotUpload(e, app)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      className={`
                        w-full px-3 py-2 rounded-lg border-2 border-dashed
                        flex items-center justify-center gap-2
                        ${uploadingScreenshot ? 'border-blue-500/50 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
                      `}
                    >
                      {uploadingScreenshot ? (
                        <>
                          <Upload className="w-4 h-4 text-blue-400 animate-bounce" />
                          <span className="text-sm text-blue-400">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Image className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Add Screenshot</span>
                        </>
                      )}
                    </button>
                    <p className="mt-1 text-xs text-gray-400">
                      Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                    </p>
                  </div>

                  {previewUrl && (
                    <div className="mt-2">
                      <img
                        src={previewUrl}
                        alt="Upload preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Edit Form */}
              {editingApp?.id === app.id && (
                <div className="mt-4 space-y-4 border-t border-gray-600 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={editingApp.name}
                      onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={editingApp.description}
                      onChange={(e) => setEditingApp({ ...editingApp, description: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                    <input
                      type="text"
                      value={editingApp.icon}
                      onChange={(e) => setEditingApp({ ...editingApp, icon: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tier</label>
                    <select
                      value={editingApp.tier}
                      onChange={(e) => setEditingApp({ ...editingApp, tier: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    >
                      <option value="base">Base</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Width</label>
                      <input
                        type="number"
                        value={editingApp.preferred_width}
                        onChange={(e) => setEditingApp({ ...editingApp, preferred_width: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Height</label>
                      <input
                        type="number"
                        value={editingApp.preferred_height}
                        onChange={(e) => setEditingApp({ ...editingApp, preferred_height: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Min Width</label>
                      <input
                        type="number"
                        value={editingApp.min_width}
                        onChange={(e) => setEditingApp({ ...editingApp, min_width: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Min Height</label>
                      <input
                        type="number"
                        value={editingApp.min_height}
                        onChange={(e) => setEditingApp({ ...editingApp, min_height: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                    <input
                      type="text"
                      value={editingApp.url}
                      onChange={(e) => setEditingApp({ ...editingApp, url: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                    <select
                      multiple
                      value={editingApp.category_ids || []}
                      onChange={(e) => setEditingApp({
                        ...editingApp,
                        category_ids: Array.from(e.target.selectedOptions, option => option.value)
                      })}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingApp(null)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
