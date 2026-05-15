import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { CheckCircle, Clock, AlertCircle, LayoutDashboard, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Failed to load stats.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Dashboard</h1>
        <p className="text-gray-300 mt-2 font-medium">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-purple-500/20 hover:-translate-y-1">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <LayoutDashboard className="h-6 w-6 text-indigo-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-semibold text-gray-300 truncate">Total Projects</dt>
                <dd className="flex items-baseline">
                  <div className="text-3xl font-bold text-white">{stats.totalProjects}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <ListTodo className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-semibold text-gray-300 truncate">Total Tasks</dt>
                <dd className="flex items-baseline">
                  <div className="text-3xl font-bold text-white">{stats.totalTasks}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-green-500/20 hover:-translate-y-1">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-500/20 rounded-xl border border-green-500/30">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-semibold text-gray-300 truncate">Completed Tasks</dt>
                <dd className="flex items-baseline">
                  <div className="text-3xl font-bold text-white">{stats.completedTasks}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-rose-500/20 hover:-translate-y-1">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 p-3 bg-rose-500/20 rounded-xl border border-rose-500/30">
              <AlertCircle className="h-6 w-6 text-rose-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-semibold text-gray-300 truncate">Overdue Tasks</dt>
                <dd className="flex items-baseline">
                  <div className="text-3xl font-bold text-rose-400">{stats.overdueTasksCount}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center border-b border-white/10 pb-4">
            <Clock className="w-6 h-6 mr-3 text-pink-400" /> Recent Tasks
          </h2>
          {stats.recentTasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent tasks.</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {stats.recentTasks.map(task => (
                <li key={task.id} className="py-4 flex justify-between items-center group">
                  <div>
                    <p className="text-base font-semibold text-white group-hover:text-pink-300 transition-colors">{task.title}</p>
                    <p className="text-sm text-gray-400">{task.project.name}</p>
                  </div>
                  <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-lg border backdrop-blur-sm
                    ${task.status === 'DONE' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                      task.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Project Progress</h2>
          {stats.projectProgress.length === 0 ? (
            <p className="text-gray-400 text-sm">No projects available.</p>
          ) : (
            <div className="space-y-6">
              {stats.projectProgress.map(project => (
                <div key={project.id}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-200">{project.name}</span>
                    <span className="text-pink-400 drop-shadow-md">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 border border-white/5 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
