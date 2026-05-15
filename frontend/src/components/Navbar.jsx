import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel mx-4 mt-4 sticky top-4 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 tracking-tight">TeamTask</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              <Link to="/" className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive('/') ? 'bg-white/20 text-white shadow-inner' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/projects" className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive('/projects') ? 'bg-white/20 text-white shadow-inner' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
                <FolderKanban className="w-4 h-4 mr-2" />
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm hidden sm:block">
              <span className="text-gray-300">Welcome, </span>
              <span className="font-bold text-white">{user.name}</span>
              <span className="ml-2 px-2 py-1 rounded-md text-xs font-bold bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white border border-white/10">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
