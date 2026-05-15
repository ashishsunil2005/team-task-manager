const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getTaskById);
router.post('/', authenticate, isAdmin, createTask);
router.put('/:id', authenticate, isAdmin, updateTask);
router.patch('/:id/status', authenticate, updateTaskStatus);
router.delete('/:id', authenticate, isAdmin, deleteTask);

module.exports = router;
