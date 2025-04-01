import React, { useState, useEffect, useRef } from 'react';
import { Folder, Search, Check, Upload, Trash2, Grid, List, MoveIcon, Download, ChevronRight, ChevronDown, Store, Menu, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import supabase from '../../../services/supabaseService';
import { useAuthContext } from '../../../context/AuthContext';
import { PreviewModal } from './PreviewModal';
import { getFileIcon } from './FileIcons';
import type { FileSystemItem, StorageSection } from './types';

export function FileSystemApp() {
  const [currentPath, setCurrentPath] = useState('/');
  const [activeSection, setActiveSection] = useState<StorageSection>('personal');
  const [showSidebar, setShowSidebar] = useState(true);
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [allItems, setAllItems] = useState<FileSystemItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { user } = useAuthContext();
  const [previewItem, setPreviewItem] = useState<FileSystemItem | null>(null);
  const [renamingItem, setRenamingItem] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [draggedItem, setDraggedItem] = useState<FileSystemItem | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [touchTimeout, setTouchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const draggedElementRef = useRef<HTMLDivElement | null>(null);

  // Load all items for hierarchy and search
  const loadAllItems = async () => {
    try {
      const { data, error } = await supabase
        .from('file_system')
        .select('*')
        .eq(activeSection === 'personal' ? 'owner_id' : 'app_id', activeSection === 'personal' ? user?.id : activeSection)
        .is('app_id', activeSection === 'personal' ? null : 'NOT.NULL')
        .order('type', { ascending: false })
        .order('name');

      if (error) throw error;
      setAllItems(data || []);
    } catch (err) {
      console.error('Error loading all files:', err);
    }
  };

  useEffect(() => {
    loadItems();
    loadAllItems();
  }, [currentPath]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('file_system')
        .select('*')
        .eq('owner_id', user?.id)
        .like('path', `${currentPath}%`)  // Get items in current path
        .not('path', 'like', `${currentPath}%/%`)  // Exclude items in subfolders
        .not('path', 'eq', currentPath)  // Exclude current path itself
        .order('type', { ascending: false })
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      for (const file of Array.from(files)) {
        // Sanitize filename by removing problematic characters
        const sanitizedName = file.name.replace(/[/\\?%*:|"<>]/g, '-');
        
        // Upload to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('user-files')
          .upload(`${user?.id}${currentPath}${sanitizedName}`, file);

        if (storageError) throw storageError;

        // Create file record
        const { error: dbError } = await supabase
          .from('file_system')
          .insert({
            name: sanitizedName,
            path: `${currentPath}${sanitizedName}`,
            type: 'file',
            mime_type: file.type,
            size: file.size,
            owner_id: user?.id,
            storage_path: storageData?.path
          });

        if (dbError) throw dbError;
      }

      loadItems();
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    try {
      const { error } = await supabase
        .from('file_system')
        .insert({
          name,
          path: `${currentPath}${name}`,
          type: 'folder',
          owner_id: user?.id
        });

      if (error) throw error;
      loadItems();
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedItems.size) return;
    if (!confirm('Are you sure you want to delete the selected items?')) return;

    try {
      // Delete from storage and database
      for (const id of selectedItems) {
        const item = items.find(i => i.id === id);
        if (!item) continue;

        if (item.type === 'file') {
          await supabase.storage
            .from('user-files')
            .remove([`${user?.id}${item.path}`]);
        }

        await supabase
          .from('file_system')
          .delete()
          .eq('id', id);
      }

      setSelectedItems(new Set());
      loadItems();
    } catch (err) {
      console.error('Error deleting items:', err);
    }
  };

  const handleCopy = async (item: FileSystemItem) => {
    try {
      if (item.type === 'file') {
        // For files, get the content from storage
        const { data } = await supabase.storage
          .from('user-files')
          .download(`${user?.id}${item.path}`);

        if (data) {
          // Create a new file with the same content
          const newName = `${item.name} (copy)`;
          const sanitizedName = newName.replace(/[/\\?%*:|"<>]/g, '-');

          // Upload the copy
          const { data: storageData, error: storageError } = await supabase.storage
            .from('user-files')
            .upload(`${user?.id}${currentPath}${sanitizedName}`, data);

          if (storageError) throw storageError;

          // Create file record
          const { error: dbError } = await supabase
            .from('file_system')
            .insert({
              name: sanitizedName,
              path: `${currentPath}${sanitizedName}`,
              type: 'file',
              mime_type: item.mime_type,
              size: item.size,
              owner_id: user?.id,
              storage_path: storageData?.path
            });

          if (dbError) throw dbError;
        }
      } else {
        // For folders, create a new folder with (copy) appended
        const newName = `${item.name} (copy)`;
        const { error } = await supabase
          .from('file_system')
          .insert({
            name: newName,
            path: `${currentPath}${newName}`,
            type: 'folder',
            owner_id: user?.id
          });

        if (error) throw error;
      }

      loadItems();
    } catch (err) {
      console.error('Error copying item:', err);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: FileSystemItem) => {
    e.stopPropagation();
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(targetId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, targetItem: FileSystemItem) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);

    if (!draggedItem || targetItem.type !== 'folder') return;

    try {
      // Calculate new path
      const newPath = `${targetItem.path}/${draggedItem.name}`;
      
      // Check if a file/folder with the same name exists in target
      const { data: existing, error: existingError } = await supabase
        .from('file_system')
        .select('id, path')
        .eq('path', newPath);

      if (existingError) throw existingError;

      if (existing && existing.length > 0) {
        alert('An item with this name already exists in the target folder');
        return;
      }

      if (draggedItem.type === 'file') {
        // Move file in storage
        const { error: storageError } = await supabase.storage
          .from('user-files')
          .move(
            `${user?.id}${draggedItem.path}`,
            `${user?.id}${newPath}`
          );

        if (storageError) throw storageError;
      }

      // Update file system record
      const { error: dbError } = await supabase
        .from('file_system')
        .update({
          path: newPath,
          parent_id: targetItem.id
        })
        .eq('id', draggedItem.id);

      if (dbError) throw dbError;

      setDraggedItem(null);
      loadItems();
    } catch (err) {
      console.error('Error moving item:', err);
      alert('Failed to move item');
    }
  };

  const handleRename = async (item: FileSystemItem) => {
    if (!newName.trim() || newName === item.name) {
      setRenamingItem(null);
      return;
    }

    try {
      // Check if name already exists in current directory
      const newPath = item.path.substring(0, item.path.lastIndexOf('/') + 1) + newName;
      const { data: existing } = await supabase
        .from('file_system')
        .select('id')
        .eq('path', newPath)
        .single();

      if (existing) {
        alert('An item with this name already exists');
        return;
      }

      if (item.type === 'file') {
        // Move file in storage
        const { error: storageError } = await supabase.storage
          .from('user-files')
          .move(
            `${user?.id}${item.path}`,
            `${user?.id}${newPath}`
          );

        if (storageError) throw storageError;
      }

      // Update file system record
      const { error: dbError } = await supabase
        .from('file_system')
        .update({
          name: newName,
          path: newPath
        })
        .eq('id', item.id);

      if (dbError) throw dbError;

      setRenamingItem(null);
      loadItems();
    } catch (err) {
      console.error('Error renaming item:', err);
      alert('Failed to rename item');
    }
  };

  const handleTouchStart = (e: React.TouchEvent, item: FileSystemItem) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    draggedElementRef.current = e.currentTarget as HTMLDivElement;
    
    // Start long press timer
    const timeout = setTimeout(() => {
      setDraggedItem(item);
      // Add visual feedback
      if (draggedElementRef.current) {
        draggedElementRef.current.style.opacity = '0.5';
      }
    }, 500);
    
    setTouchTimeout(timeout);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos || !draggedItem) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartPos.x;
    const deltaY = touch.clientY - touchStartPos.y;

    // If moved more than 10px, cancel long press
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
        setTouchTimeout(null);
      }
    }

    // Find drop target
    const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
    const dropTargetEl = elementsAtPoint.find(el => el.getAttribute('data-folder-id'));
    if (dropTargetEl) {
      setDropTarget(dropTargetEl.getAttribute('data-folder-id'));
    } else {
      setDropTarget(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, item: FileSystemItem) => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }

    // Reset visual state
    if (draggedElementRef.current) {
      draggedElementRef.current.style.opacity = '1';
    }

    if (draggedItem && dropTarget) {
      const targetItem = items.find(i => i.id === dropTarget);
      if (targetItem) {
        handleDrop(e as any, targetItem);
      }
    }

    setDraggedItem(null);
    setDropTarget(null);
    setTouchStartPos(null);
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (renamingItem === item.id) return;

    // For folders, navigate into them
    if (item.type === 'folder') {
      setCurrentPath(`${item.path}/`);
      return;
    }
    
    // For files, show preview if supported
    const supportedTypes = [
      'image/',
      'application/pdf',
      'text/',
      'video/',
      'audio/'
    ];
    
    const isSupported = supportedTypes.some(type => 
      item.mime_type?.startsWith(type)
    );
    
    if (isSupported) {
      setPreviewItem(item);
    }
  };

  const handleItemSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDownload = async (item: FileSystemItem) => {
    try {
      const { data } = await supabase.storage
        .from('user-files')
        .createSignedUrl(`${user?.id}${item.path}`, 3600, {
          download: item.name
        });

      if (data?.signedUrl) {
        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file');
    }
  };

  const filteredItems = searchQuery
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  // Render folder hierarchy
  const renderFolderTree = (parentPath = '/') => {
    const children = allItems.filter(item => {
      const itemParent = item.path.substring(0, item.path.lastIndexOf('/') + 1);
      return itemParent === parentPath;
    });

    if (!children.length) return null;

    return (
      <div className="pl-4">
        {children.map(item => {          
          const isExpanded = expandedFolders.has(item.path + '/');
          const hasChildren = item.type === 'folder' && allItems.some(child => 
            child.path.startsWith(item.path + '/')
          );
          const Icon = item.type === 'folder' ? Folder : getFileIcon(item.mime_type);
          const iconColor = item.type === 'folder' ? 'text-blue-400' :
            item.mime_type?.startsWith('image/') ? 'text-purple-400' :
            item.mime_type === 'application/pdf' ? 'text-red-400' :
            item.mime_type?.startsWith('video/') ? 'text-green-400' :
            item.mime_type?.startsWith('audio/') ? 'text-yellow-400' :
            'text-gray-400';

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.type === 'folder') {
                    setCurrentPath(item.path + '/');
                    const newExpanded = new Set(expandedFolders);
                    if (isExpanded) {
                      newExpanded.delete(item.path + '/');
                    } else {
                      newExpanded.add(item.path + '/');
                    }
                    setExpandedFolders(newExpanded);
                  } else {
                    handleItemClick(item);
                  }
                }}
                className={`
                  flex items-center gap-1 py-2 px-2 rounded-lg w-full text-left
                  hover:bg-gray-800 transition-colors touch-manipulation
                  ${item.type === 'folder' && currentPath === item.path + '/' ? 'bg-blue-500/20' : ''}
                  ${item.type === 'file' ? 'text-gray-300' : 'text-blue-400'}
                `}
              >
                {item.type === 'folder' && hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newExpanded = new Set(expandedFolders);
                      if (isExpanded) {
                        newExpanded.delete(item.path + '/');
                      } else {
                        newExpanded.add(item.path + '/');
                      }
                      setExpandedFolders(newExpanded);
                    }}
                    className="p-1 hover:bg-gray-700 rounded touch-manipulation"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <span className="truncate text-sm">{item.name}</span>
              </button>
              {item.type === 'folder' && isExpanded && renderFolderTree(item.path + '/')}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className={`
          ${showSidebar ? 'w-64' : 'w-0 -ml-64'} 
          md:w-64 md:ml-0
          border-r border-gray-800 flex flex-col 
          transition-all duration-300 ease-in-out
          fixed md:relative
          h-full
          z-20
          bg-gray-900
        `}>
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-medium">Folders</h2>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  setActiveSection('personal');
                  setCurrentPath('/');
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors
                  ${activeSection === 'personal' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}
                `}
              >
                <Folder className="w-4 h-4" />
                Personal Storage
              </button>
              <button
                onClick={() => {
                  setActiveSection('apps');
                  setCurrentPath('/');
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors
                  ${activeSection === 'apps' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}
                `}
              >
                <Store className="w-4 h-4" />
                App Storage
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <button
              onClick={() => setCurrentPath('/')}
              className={`
                flex items-center gap-2 py-2 px-2 rounded-lg w-full text-left
                hover:bg-gray-800 transition-colors
                ${currentPath === '/' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'}
              `}
            >
              <Folder className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Home</span>
            </button>
            {renderFolderTree()}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Toolbar */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-800">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateFolder}
                className="p-2 hover:bg-gray-800 rounded-lg"
                title="New Folder"
              >
                <Folder className="w-5 h-5" />
              </button>
              <label className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer" title="Upload File">
                <Download className="w-5 h-5" />
                <input type="file" multiple onChange={handleUpload} className="hidden" />
              </label>
              {selectedItems.size > 0 && (
                <button
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-900/50 rounded-lg text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files and folders..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Overlay */}
          {showSidebar && (
            <div 
              className="fixed inset-0 bg-black/50 z-10 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50">
            <button
              onClick={() => setCurrentPath('/')}
              className="hover:text-blue-400"
            >
              Home
            </button>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <span>/</span>
                <button
                  onClick={() => setCurrentPath('/' + breadcrumbs.slice(0, i + 1).join('/') + '/')}
                  className="hover:text-blue-400"
                >
                  {crumb}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* File/Folder Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">Loading...</div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">No items found</div>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-4 gap-4' : 'space-y-2'}>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-folder-id={item.type === 'folder' ? item.id : undefined}
                    className={`
                      relative group cursor-pointer
                      ${viewMode === 'grid'
                        ? 'p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800'
                        : 'p-2 hover:bg-gray-800/50 rounded-lg flex items-center gap-2 md:gap-4'
                      }
                      ${selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''}
                      ${dropTarget === item.id && item.type === 'folder' ? 'ring-2 ring-green-500 bg-green-500/10' : ''}
                      ${draggedItem?.id === item.id ? 'opacity-50' : ''}
                    `}
                    onDoubleClick={() => handleItemClick(item)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, item)}
                    ref={item.id === draggedItem?.id ? draggedElementRef : null}
                    onTouchStart={(e) => handleTouchStart(e, item)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={(e) => handleTouchEnd(e, item)}
                  >
                    <div className={viewMode === 'grid' ? 'text-center' : 'flex items-center gap-4 flex-1'}>
                      {React.createElement(
                        item.type === 'folder' ? Folder : getFileIcon(item.mime_type),
                        {
                          className: `${
                            viewMode === 'grid' ? 'w-16 h-16 mx-auto mb-2' : 'w-6 h-6'
                          } ${
                            item.type === 'folder' ? 'text-blue-400' :
                            item.mime_type?.startsWith('image/') ? 'text-purple-400' :
                            item.mime_type === 'application/pdf' ? 'text-red-400' :
                            item.mime_type?.startsWith('video/') ? 'text-green-400' :
                            item.mime_type?.startsWith('audio/') ? 'text-yellow-400' :
                            'text-gray-400'
                          }`
                        }
                      )}
                      <div className={viewMode === 'grid' ? 'truncate relative' : 'flex-1 relative'}>
                        {renamingItem === item.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleRename(item);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="w-full bg-gray-700 text-white rounded px-2 py-1"
                              autoFocus
                              onBlur={() => handleRename(item)}
                            />
                          </form>
                        ) : (
                          <div
                            className="font-medium truncate"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenamingItem(item.id);
                              setNewName(item.name);
                            }}
                          >
                            {item.name}
                          </div>
                        )}
                        {viewMode === 'list' && (
                          <div className="text-sm text-gray-400">
                            {item.type === 'file' &&
                              item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Folder'
                            }
                          </div>
                        )}
                      </div>
                      {draggedItem && item.type === 'folder' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 rounded-lg opacity-0 group-hover:opacity-100">
                          <MoveIcon className="w-8 h-8 text-green-400" />
                        </div>
                      )}
                    </div>
                    
                    {item.type === 'file' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.currentTarget.classList.add('bg-gray-700');
                        }}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          e.currentTarget.classList.remove('bg-gray-700');
                          handleDownload(item);
                        }}
                        className={`
                          absolute top-2 left-2 p-3 rounded-lg
                          opacity-0 group-hover:opacity-100 hover:bg-gray-700
                          text-gray-400 hover:text-blue-400 transition-colors
                          min-w-touch min-h-touch touch-manipulation
                        `}
                        title="Download file"
                      >
                        <Upload className="w-6 h-6" />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleItemSelect(item.id, e)}
                      className={`
                        absolute top-2 right-2 p-2 rounded-lg
                        ${selectedItems.has(item.id)
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'opacity-0 group-hover:opacity-100 hover:bg-gray-700'
                        }
                      `}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      className="absolute top-2 right-12 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-700"
                      title="Copy">
                      <Copy className="w-5 h-5 text-gray-400" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
            
            {previewItem && (
              <PreviewModal
                item={previewItem}
                onClose={() => setPreviewItem(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}