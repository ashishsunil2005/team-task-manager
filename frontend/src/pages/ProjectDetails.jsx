import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Plus, UserMinus, Trash2, Edit2, Calendar } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchProject();
    if (user.role === 'ADMIN') {
      fetchUsers();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setAllUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { userId: selectedUserId });
      setShowMemberModal(false);
      setSelectedUserId('');
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      fetchProject();
    } catch (error) {
      alert('Failed to remove member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchProject();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchProject();
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading project details...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Project not found or access denied.</div>;

  const projectMembers = project.members.map(m => m.user);

  return (
    <div>
      <div className="mb-8 glass-panel p-8 border-t-4 border-t-pink-500">
        <h1 className="text-4xl font-extrabold text-white mb-2">{project.name}</h1>
        <p className="text-gray-300 text-lg">{project.description || 'No description provided.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Tasks</h2>
            {user.role === 'ADMIN' && (
              <button
                onClick={() => setShowTaskModal(true)}
                className="vibrant-btn inline-flex items-center px-4 py-2 text-sm"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Task
              </button>
            )}
          </div>

          <div className="glass-panel overflow-hidden">
            {project.tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No tasks in this project yet.</div>
            ) : (
              <ul className="divide-y divide-white/10">
                {project.tasks.map((task) => {
                  const isAssignedToMe = task.assignedToId === user.id;
                  const canUpdateStatus = user.role === 'ADMIN' || isAssignedToMe;
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

                  return (
                    <li key={task.id} className="p-6 hover:bg-white/5 transition duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white flex items-center">
                            {task.title}
                            {isOverdue && <span className="ml-3 px-2 py-0.5 rounded text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Overdue</span>}
                          </h3>
                          <p className="mt-2 text-sm text-gray-300 line-clamp-2">{task.description}</p>
                          <div className="mt-3 flex items-center text-xs text-gray-400 space-x-4">
                            <span className="flex items-center bg-white/5 px-2 py-1 rounded-md border border-white/10">Priority: <span className={`ml-1 font-bold ${task.priority==='HIGH'?'text-rose-400':task.priority==='MEDIUM'?'text-yellow-400':'text-green-400'}`}>{task.priority}</span></span>
                            {task.dueDate && (
                              <span className="flex items-center bg-white/5 px-2 py-1 rounded-md border border-white/10"><Calendar className="w-3 h-3 mr-1.5 text-blue-400"/> {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                            {task.assignedTo && (
                              <span className="flex items-center bg-white/5 px-2 py-1 rounded-md border border-white/10">Assigned to: <span className="ml-1 font-bold text-purple-300">{task.assignedTo.name}</span></span>
                            )}
                          </div>
                        </div>
                        <div className="ml-6 flex items-center space-x-4">
                          <select
                            value={task.status}
                            disabled={!canUpdateStatus}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                            className="glass-input block w-full pl-3 pr-8 py-2 text-sm font-semibold disabled:opacity-50"
                          >
                            <option value="TODO" className="text-gray-900">To Do</option>
                            <option value="IN_PROGRESS" className="text-gray-900">In Progress</option>
                            <option value="DONE" className="text-gray-900">Done</option>
                          </select>
                          {user.role === 'ADMIN' && (
                            <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Team Members</h2>
            {user.role === 'ADMIN' && (
              <button
                onClick={() => setShowMemberModal(true)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
              >
                <UserPlus className="mr-1.5 h-4 w-4" /> Add
              </button>
            )}
          </div>
          
          <div className="glass-panel overflow-hidden">
            <ul className="divide-y divide-white/10">
              {projectMembers.map((member) => (
                <li key={member.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-white">{member.name}</p>
                      <p className="text-xs text-pink-300 font-medium mt-0.5">{member.role}</p>
                    </div>
                  </div>
                  {user.role === 'ADMIN' && member.id !== user.id && (
                    <button onClick={() => handleRemoveMember(member.id)} className="text-gray-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto backdrop-blur-sm bg-black/60" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowTaskModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom glass-panel px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6" id="modal-title">Add New Task</h3>
                <form onSubmit={handleCreateTask} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Title</label>
                    <input type="text" required className="glass-input block w-full py-3 px-4" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Description</label>
                    <textarea rows="3" className="glass-input block w-full py-3 px-4" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">Priority</label>
                      <select className="glass-input block w-full py-3 px-4 text-gray-900 focus:text-white" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">Due Date</label>
                      <input type="date" className="glass-input block w-full py-3 px-4 text-gray-900 focus:text-white" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Assign To</label>
                    <select className="glass-input block w-full py-3 px-4 text-gray-900 focus:text-white" value={newTask.assignedToId} onChange={(e) => setNewTask({...newTask, assignedToId: e.target.value})}>
                      <option value="">Unassigned</option>
                      {projectMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-8 sm:grid sm:grid-cols-2 sm:gap-4 sm:grid-flow-row-dense">
                    <button type="submit" className="w-full vibrant-btn py-3 px-4 sm:col-start-2 text-sm">Add Task</button>
                    <button type="button" onClick={() => setShowTaskModal(false)} className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/20 px-4 py-3 bg-white/5 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all sm:mt-0 sm:col-start-1">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto backdrop-blur-sm bg-black/60" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowMemberModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom glass-panel px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6" id="modal-title">Add Team Member</h3>
                <form onSubmit={handleAddMember} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Select User</label>
                    <select required className="glass-input block w-full py-3 px-4 text-gray-900 focus:text-white" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                      <option value="">Select a user</option>
                      {allUsers.filter(u => !projectMembers.find(m => m.id === u.id)).map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-8 sm:grid sm:grid-cols-2 sm:gap-4 sm:grid-flow-row-dense">
                    <button type="submit" disabled={!selectedUserId} className="w-full vibrant-btn py-3 px-4 disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-none sm:col-start-2 text-sm">Add Member</button>
                    <button type="button" onClick={() => setShowMemberModal(false)} className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/20 px-4 py-3 bg-white/5 text-sm font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all sm:mt-0 sm:col-start-1">Cancel</button>
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

export default ProjectDetails;
