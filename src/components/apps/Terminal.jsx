import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const COMMANDS = {
  HELP: {
    name: 'help',
    description: 'Show available commands',
    usage: 'help [command]'
  },
  CLEAR: {
    name: 'clear',
    description: 'Clear terminal screen',
    usage: 'clear'
  },
  ECHO: {
    name: 'echo',
    description: 'Display a message',
    usage: 'echo <message>'
  },
  LS: {
    name: 'ls',
    description: 'List directory contents',
    usage: 'ls [directory]'
  },
  CD: {
    name: 'cd',
    description: 'Change directory',
    usage: 'cd <directory>'
  },
  PWD: {
    name: 'pwd',
    description: 'Print working directory',
    usage: 'pwd'
  },
  DATE: {
    name: 'date',
    description: 'Display current date and time',
    usage: 'date'
  },
  WHOAMI: {
    name: 'whoami',
    description: 'Display current user',
    usage: 'whoami'
  }
};

export function Terminal() {
  const [history, setHistory] = useState(['Welcome to ReEnvisionAI.os Terminal']);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('~');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  const addToHistory = (command) => {
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
  };

  const handleCommand = (cmd) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case COMMANDS.CLEAR.name:
        setHistory([]);
        break;

      case COMMANDS.ECHO.name:
        setHistory(prev => [...prev, args.join(' ')]);
        break;

      case COMMANDS.PWD.name:
        setHistory(prev => [...prev, currentDir]);
        break;

      case COMMANDS.CD.name:
        if (args[0]) {
          const newDir = args[0] === '~' ? '~' : `${currentDir}/${args[0]}`;
          setCurrentDir(newDir);
          setHistory(prev => [...prev, `Changed directory to ${newDir}`]);
        }
        break;

      case COMMANDS.DATE.name:
        setHistory(prev => [...prev, new Date().toLocaleString()]);
        break;

      case COMMANDS.WHOAMI.name:
        setHistory(prev => [...prev, 'demo']);
        break;

      case COMMANDS.LS.name:
        const files = ['Documents', 'Pictures', 'Downloads', 'Music'];
        setHistory(prev => [...prev, ...files]);
        break;

      case COMMANDS.HELP.name:
        if (args[0]) {
          const cmd = COMMANDS[args[0].toUpperCase()];
          if (cmd) {
            setHistory(prev => [...prev,
              `${cmd.name} - ${cmd.description}`,
              `Usage: ${cmd.usage}`
            ]);
          } else {
            setHistory(prev => [...prev, `Command not found: ${args[0]}`]);
          }
        } else {
          setHistory(prev => [...prev,
            'Available commands:',
            ...Object.values(COMMANDS).map(cmd => 
              `  ${cmd.name.padEnd(8)} - ${cmd.description}`
            )
          ]);
        }
        break;

      default:
        setHistory(prev => [...prev, `Command not found: ${command}`]);
        setHistory(prev => [...prev, 'Type "help" for available commands']);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory(prev => [...prev, `${currentDir} $ ${input}`]);
    handleCommand(input);
    addToHistory(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="h-full bg-gray-900 p-4 font-mono text-sm overflow-auto"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-1">
        {history.map((line, i) => (
          <div key={i} className="text-gray-200 whitespace-pre-wrap">{line}</div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-500 mr-2">{currentDir} $</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </form>
      </div>
    </div>
  );
}