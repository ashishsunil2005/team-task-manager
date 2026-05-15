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
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <p className="mt-2 text-gray-600">{project.description || 'No description provided.'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            {user.role === 'ADMIN' && (
              <button
                onClick={() => setShowTaskModal(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Task
              </button>
            )}
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
            {project.tasks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No tasks in this project yet.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {project.tasks.map((task) => {
                  const isAssignedToMe = task.assignedToId === user.id;
                  const canUpdateStatus = user.role === 'ADMIN' || isAssignedToMe;
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

                  return (
                    <li key={task.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            {task.title}
                            {isOverdue && <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Overdue</span>}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                            <span>Priority: <span className={`font-semibold ${task.priority==='HIGH'?'text-red-600':task.priority==='MEDIUM'?'text-yellow-600':'text-green-600'}`}>{task.priority}</span></span>
                            {task.dueDate && (
                              <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                            {task.assignedTo && (
                              <span>Assigned to: <span className="font-semibold text-gray-700">{task.assignedTo.name}</span></span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-3">
                          <select
                            value={task.status}
                            disabled={!canUpdateStatus}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                            className="block w-full pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                          {user.role === 'ADMIN' && (
                            <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 p-1">
                              <Trash2 className="w-4 h-4" />
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            {user.role === 'ADMIN' && (
              <button
                onClick={() => setShowMemberModal(true)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <UserPlus className="mr-1 h-3 w-3" /> Add
              </button>
            )}
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {projectMembers.map((member) => (
                <li key={member.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                  {user.role === 'ADMIN' && member.id !== user.id && (
                    <button onClick={() => handleRemoveMember(member.id)} className="text-red-400 hover:text-red-600">
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
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowTaskModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add New Task</h3>
                <form onSubmit={handleCreateTask} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Due Date</label>
                      <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assign To</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={newTask.assignedToId} onChange={(e) => setNewTask({...newTask, assignedToId: e.target.value})}>
                      <option value="">Unassigned</option>
                      {projectMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:col-start-2 sm:text-sm">Add Task</button>
                    <button type="button" onClick={() => setShowTaskModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowMemberModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add Team Member</h3>
                <form onSubmit={handleAddMember} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select User</label>
                    <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                      <option value="">Select a user</option>
                      {allUsers.filter(u => !projectMembers.find(m => m.id === u.id)).map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" disabled={!selectedUserId} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300 sm:col-start-2 sm:text-sm">Add</button>
                    <button type="button" onClick={() => setShowMemberModal(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm">Cancel</button>
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
