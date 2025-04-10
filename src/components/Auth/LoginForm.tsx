import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

// Define props interface
interface LoginFormProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isLogin, setIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Removed local isLogin state

  const navigate = useNavigate();
  const {signIn} = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/desktop');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-black/50 backdrop-blur-xl rounded-lg shadow-lg border border-blue-900/50">
      {error && <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded">{error}</div>}

      {/* Moved toggle link here */}
      <div className="mb-6 text-center text-sm">
        <span className="text-gray-300">Don't have an account? </span>
        <button
          type="button" // Important: prevent form submission
          onClick={() => setIsLogin(false)} // Use passed function
          className="text-blue-400 hover:text-blue-300 underline font-medium"
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg bg-black/70 border border-blue-900/50 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-lg bg-black/70 border border-blue-900/50 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full py-2 px-4 bg-blue-600/90 hover:bg-blue-700/90 text-white font-semibold
            rounded-lg shadow-md backdrop-blur transition-all hover:scale-[1.02]
            border border-blue-900/50 relative
            ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
