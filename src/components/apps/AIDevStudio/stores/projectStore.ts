import { create } from 'zustand';
import { defaultTemplate } from '../templates/defaultTemplate';

interface ProjectFile {
  path: string;
  content: string;
}

interface ProjectState {
  files: Record<string, string>;
  currentFile: ProjectFile | null;
  currentProject: string | null;
  setCurrentFile: (path: string) => void;
  updateFile: (path: string, content: string) => void;
  createFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  loadProject: (files: Record<string, string>) => void;
  saveProject: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  files: defaultTemplate.files,
  currentFile: null,
  currentProject: null,

  setCurrentFile: (path) => {
    const { files } = get();
    if (files[path]) {
      set({ currentFile: { path, content: files[path] } });
    }
  },

  updateFile: (path, content) => {
    set((state) => ({
      files: { ...state.files, [path]: content }
    }));
  },

  createFile: (path, content) => {
    set((state) => ({
      files: { ...state.files, [path]: content }
    }));
  },

  deleteFile: (path) => {
    set((state) => {
      const files = { ...state.files };
      delete files[path];
      return { files };
    });
  },

  loadProject: (files) => {
    set({ files, currentFile: null });
  },

  saveProject: () => {
    const { files } = get();
    // Save to localStorage or your preferred storage
    localStorage.setItem('aidev_project', JSON.stringify(files));
  }
}));