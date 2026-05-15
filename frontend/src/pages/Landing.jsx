import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-4xl w-full">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 tracking-tight leading-tight mb-6">
          Supercharge Your Team's Productivity
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          The ultimate task manager for modern teams. Organize projects, assign tasks, and track progress with a stunning, vibrant interface that makes work feel like play.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/signup" className="vibrant-btn px-8 py-4 text-lg inline-flex items-center justify-center">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/login" className="glass-panel px-8 py-4 text-lg font-bold text-white hover:bg-white/20 transition-all text-center">
            Sign In
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-5xl rounded-2xl p-2 bg-gradient-to-r from-pink-500/30 to-purple-500/30 shadow-[0_0_50px_-12px_rgba(236,72,153,0.5)]">
          <div className="glass-panel overflow-hidden border-0">
            <img 
              src="/hero.png" 
              alt="TeamTask Dashboard Mockup" 
              className="w-full h-auto object-cover rounded-xl shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
            <Zap className="w-10 h-10 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Experience a snappy, responsive interface built with modern web technologies that keep you in the flow.</p>
          </div>
          <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
            <CheckCircle className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Intuitive Organization</h3>
            <p className="text-gray-400">Manage multiple projects effortlessly with dedicated workspaces, member roles, and structured task states.</p>
          </div>
          <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
            <Shield className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400">Role-based access control ensures members only see what they need, keeping your administrative data safe.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
