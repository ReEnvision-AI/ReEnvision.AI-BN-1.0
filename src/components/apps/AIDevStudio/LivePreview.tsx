import { Sandpack } from '@codesandbox/sandpack-react';
import { useProjectStore } from './stores/projectStore';

export function LivePreview() {
  const { files } = useProjectStore();

  // Convert project files to Sandpack format
  const sandpackFiles = Object.entries(files).reduce((acc, [path, content]) => {
    acc[path] = { code: content };
    return acc;
  }, {} as Record<string, { code: string }>);

  return (
    <div className="h-full">
      <Sandpack
        template="vite-react-ts"
        theme="dark"
        files={sandpackFiles}
        options={{
          showNavigator: true,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: '100%',
          classes: {
            'sp-wrapper': 'h-full',
            'sp-layout': 'h-full',
            'sp-stack': 'h-full'
          }
        }}
      />
    </div>
  );
}