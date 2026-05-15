const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProjectById);
router.post('/', authenticate, isAdmin, createProject);
router.put('/:id', authenticate, isAdmin, updateProject);
router.delete('/:id', authenticate, isAdmin, deleteProject);
router.post('/:id/members', authenticate, isAdmin, addMember);
router.delete('/:id/members/:userId', authenticate, isAdmin, removeMember);

module.exports = router;
