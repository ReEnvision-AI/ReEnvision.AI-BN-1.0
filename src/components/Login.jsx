import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { NeuralAnimation } from './NeuralAnimation';

export function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (username === 'demo' && password === 'demo') {
        localStorage.setItem('currentUser', JSON.stringify({ username }));
        localStorage.setItem('user', JSON.stringify({ username, password }));
        onLogin();
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 safe-top safe-bottom overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              #001F3F,
              #1a237e,
              #004D40,
              #E92716,
              #1A237E
            )`,
          backgroundSize: '400% 400%',
          animation: 'rainbow 15s ease infinite'
        }}
      />
      
      {/* Neural network animation */}
      <div className="absolute inset-0 z-10">
        <NeuralAnimation />
      </div>

      <style>
        {`
          @keyframes rainbow {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}
      </style>

      {/* Login form */}
      <div className="relative z-20 bg-gray-900/40 p-8 rounded-lg backdrop-blur-sm w-full max-w-md border border-white/5">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-white/5 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-white/80" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Welcome to Workstudio.ai</h1>
          <p className="text-white/60 text-center">Sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded bg-gray-800/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
              placeholder="Enter your username"
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded bg-gray-800/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-white/10"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-300 bg-red-500/10 p-3 rounded border border-red-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded text-white font-medium
              transition-colors focus:outline-none focus:ring-2 focus:ring-white/20
              ${isLoading 
                ? 'bg-indigo-600/50 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'}
            `}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-white/40 text-sm text-center">
            Default credentials: demo / demo
          </p>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
};