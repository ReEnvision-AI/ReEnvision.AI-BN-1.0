import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useProjectStore } from './stores/projectStore';

export function CodeEditor() {
  const { currentFile, updateFile } = useProjectStore();
  const monacoRef = useRef(null);

  useEffect(() => {
    if (monacoRef.current) {
      // Configure TypeScript
      monacoRef.current.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monacoRef.current.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monacoRef.current.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monacoRef.current.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monacoRef.current.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types']
      });

      // Add React types
      fetch('https://unpkg.com/@types/react@latest/index.d.ts').then(response => 
        response.text()
      ).then(types => {
        monacoRef.current?.languages.typescript.typescriptDefaults.addExtraLib(
          types,
          'file:///node_modules/@types/react/index.d.ts'
        );
      });
    }
  }, [monacoRef]);

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = monaco;
  };

  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to edit
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      defaultValue={currentFile.content}
      theme="vs-dark"
      onChange={(value) => updateFile(currentFile.path, value || '')}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        rulers: [80, 100],
        bracketPairColorization: { enabled: true },
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        tabSize: 2,
        wordWrap: 'on'
      }}
    />
  );
}