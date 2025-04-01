import React, { useState, useCallback } from 'react';
import { MessageSquare, Trash2, Edit2, Check, X } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { motion } from 'framer-motion';

export function ChatHistory() {
  const chatHistory = useChatStore((state) => state.chatHistory);
  const currentChatId = useChatStore((state) => state.currentChatId);
  const loadChat = useChatStore((state) => state.loadChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const updateChatTitle = useChatStore((state) => state.updateChatTitle);
  const createNewChat = useChatStore((state) => state.createNewChat);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEdit = useCallback((chatId: string, currentTitle: string) => {
    setEditingId(chatId);
    setEditTitle(currentTitle);
  }, []);

  const handleUpdateTitle = useCallback((chatId: string) => {
    if (editTitle.trim()) {
      updateChatTitle(chatId, editTitle);
      setEditingId(null);
    }
  }, [editTitle, updateChatTitle]);

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const handleLoadChat = useCallback((chatId: string) => {
    loadChat(chatId);
  }, [loadChat]);

  const handleDeleteChat = useCallback((e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  }, [deleteChat]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-2">
          {chatHistory.map((chat) => (
            <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                group flex items-center gap-2 p-2 rounded-lg cursor-pointer
                ${chat.id === currentChatId ? 'bg-gray-700' : 'hover:bg-gray-800'}
              `}
              onClick={() => handleLoadChat(chat.id)}
            >
              <MessageSquare className="w-4 h-4 text-gray-400" />
              
              {editingId === chat.id ? (
                <div className="flex-1 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-gray-900 text-white px-2 py-1 rounded"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdateTitle(chat.id)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <Check className="w-4 h-4 text-green-400" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{chat.title}</div>
                    <div className="text-xs text-gray-400">{formatDate(chat.updatedAt)}</div>
                  </div>

                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(chat.id, chat.title);
                      }}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="p-1 hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
