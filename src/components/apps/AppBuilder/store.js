import create from 'zustand';
import { defaultTemplate } from './templates/fullstack';

export const useAppBuilderStore = create((set, get) => ({
  currentProject: defaultTemplate,
  savedProjects: [],

  updateProject: (project) => set({ currentProject: project }),

  saveProject: async (project) => {
    const { savedProjects } = get();
    const updatedProjects = [...savedProjects];
    const existingIndex = updatedProjects.findIndex(p => p.id === project.id);

    if (existingIndex >= 0) {
      updatedProjects[existingIndex] = project;
    } else {
      updatedProjects.push(project);
    }

    set({ savedProjects: updatedProjects });
    localStorage.setItem('appbuilder_projects', JSON.stringify(updatedProjects));
  },

  publishToStore: async (project) => {
    // Here you would typically handle the deployment process
    // For now, we'll just save it as a published app
    const publishedApps = JSON.parse(localStorage.getItem('published_apps') || '[]');
    publishedApps.push({
      ...project,
      publishedAt: new Date().toISOString()
    });
    localStorage.setItem('published_apps', JSON.stringify(publishedApps));
  }
}));