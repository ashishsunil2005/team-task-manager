import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 tracking-tight">Welcome Back</h2>
          <p className="text-gray-300 mt-2 font-medium">Sign in to your account</p>
        </div>
        
        {error && <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-sm font-medium backdrop-blur-md">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Email</label>
            <input
              type="email"
              required
              className="glass-input block w-full px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Password</label>
            <input
              type="password"
              required
              className="glass-input block w-full px-4 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full vibrant-btn py-3 px-4 mt-8"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-pink-400 hover:text-pink-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
