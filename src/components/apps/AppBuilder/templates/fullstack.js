export const defaultTemplate = {
  id: 'new-app',
  name: 'New Application',
  description: '',
  version: '1.0.0',
  author: '',
  repository: '',
  keywords: [],
  category: 'development',
  files: {
    '/frontend': {
      'App.js': `
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to your new app!</h1>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}`,
      'styles.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    '/backend': {
      'index.js': `
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
      'routes': {
        'api.js': `
const router = require('express').Router();

router.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;`
      }
    }
  },
  frontend: {
    files: {
      '/App.js': `
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to your new app!</h1>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}`,
      '/styles.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    dependencies: {
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'tailwindcss': '^3.3.3'
    }
  },
  backend: {
    code: `
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`,
    dependencies: {
      'express': '^4.18.2',
      'cors': '^2.8.5'
    },
    logs: []
  }
};