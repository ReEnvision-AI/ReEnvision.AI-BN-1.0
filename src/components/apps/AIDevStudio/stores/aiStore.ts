import { create } from 'zustand';
import { useProjectStore } from './projectStore';

interface AIState {
  isGenerating: boolean;
  error: string | null;
  generateCode: (prompt: string, currentFile?: string) => Promise<void>;
}

export const useAIStore = create<AIState>((set) => ({
  isGenerating: false,
  error: null,

  generateCode: async (prompt, currentFile) => {
    set({ isGenerating: true, error: null });

    try {
      // This is a mock implementation - replace with actual OpenAI API call
      const response = await mockGenerateCode(prompt);
      
      if (currentFile) {
        useProjectStore.getState().updateFile(currentFile, response);
      } else {
        // Create new file
        const fileName = generateFileName(prompt);
        useProjectStore.getState().createFile(fileName, response);
        useProjectStore.getState().setCurrentFile(fileName);
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isGenerating: false });
    }
  }
}));

// Mock implementation - replace with actual OpenAI API
async function mockGenerateCode(prompt: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `// Generated code for: ${prompt}\n\nexport function Component() {\n  return (\n    <div>Generated component</div>\n  );\n}`;
}

function generateFileName(prompt: string): string {
  const sanitized = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `/src/components/${sanitized}.tsx`;
}