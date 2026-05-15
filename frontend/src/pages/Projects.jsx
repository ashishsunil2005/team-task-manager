import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, FolderKanban, Users, ListTodo } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Projects</h1>
          <p className="text-gray-300 mt-2 font-medium">Manage your team projects and tasks.</p>
        </div>
        {user.role === 'ADMIN' && (
          <button
            onClick={() => setShowModal(true)}
            className="vibrant-btn inline-flex items-center px-5 py-2.5"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="glass-panel overflow-hidden transition-all duration-300 hover:shadow-purple-500/30 hover:-translate-y-1 flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <FolderKanban className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <h3 className="text-xl font-bold text-white truncate">
                    <Link to={`/projects/${project.id}`} className="hover:text-pink-400 transition-colors">
                      {project.name}
                    </Link>
                  </h3>
                </div>
              </div>
              <div className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided.'}
              </div>
            </div>
            <div className="bg-black/20 px-6 py-4 border-t border-white/10 flex justify-between">
              <div className="text-sm font-semibold text-gray-300 flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-pink-400" /> {project._count.members} Members
              </div>
              <div className="text-sm font-semibold text-gray-300 flex items-center">
                <ListTodo className="w-4 h-4 mr-1.5 text-blue-400" /> {project._count.tasks} Tasks
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 glass-panel">
            <FolderKanban className="mx-auto h-16 w-16 text-gray-500 mb-4" />
            <h3 className="text-lg font-bold text-white">No projects</h3>
            <p className="mt-2 text-sm text-gray-400">Get started by creating a new project.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto backdrop-blur-sm bg-black/60" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom glass-panel px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6" id="modal-title">Create New Project</h3>
                <form onSubmit={handleCreateProject} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Project Name</label>
                    <input
                      type="text"
                      required
                      className="glass-input block w-full py-3 px-4"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Description</label>
                    <textarea
                      rows={3}
                      className="glass-input block w-full py-3 px-4"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    />
                  </div>
                  <div className="mt-8 sm:grid sm:grid-cols-2 sm:gap-4 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full vibrant-btn py-3 px-4 sm:col-start-2 text-sm"
                    >
                      Create Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/20 px-4 py-3 bg-white/5 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all sm:mt-0 sm:col-start-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
