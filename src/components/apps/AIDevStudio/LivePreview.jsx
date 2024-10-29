import { Sandpack } from '@codesandbox/sandpack-react';

export function LivePreview({ files }) {
  return (
    <div className="h-full">
      <Sandpack
        files={files}
        theme="dark"
        template="vite-react"
        customSetup={{
          dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "@types/react": "^18.2.15",
            "@types/react-dom": "^18.2.7",
            "@vitejs/plugin-react": "^4.0.3",
            "autoprefixer": "^10.4.16",
            "postcss": "^8.4.31",
            "tailwindcss": "^3.3.3",
            "vite": "^4.4.5"
          }
        }}
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