const prisma = require('../utils/prismaClient');

const getTasks = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { projectId } = req.query;

    let whereClause = {};
    if (projectId) whereClause.projectId = projectId;

    if (role !== 'ADMIN') {
      whereClause.assignedToId = userId;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } }
      }
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (role !== 'ADMIN' && task.assignedToId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId, assignedToId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    // Verify assignedToId is a member of the project
    if (assignedToId) {
      const isMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: { projectId, userId: assignedToId }
        }
      });
      if (!isMember) {
        return res.status(400).json({ message: 'Assignee must be a member of the project' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assignedToId,
        createdById: req.user.id
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, dueDate, assignedToId } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId
      }
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { role, id: userId } = req.user;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (role !== 'ADMIN' && task.assignedToId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({ where: { id } });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
