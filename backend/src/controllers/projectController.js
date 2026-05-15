const prisma = require('../utils/prismaClient');

const getProjects = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let projects;
    if (role === 'ADMIN') {
      projects = await prisma.project.findMany({
        include: {
          _count: { select: { tasks: true, members: true } },
          tasks: { select: { status: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: {
            some: { userId }
          }
        },
        include: {
          _count: { select: { tasks: true, members: true } },
          tasks: { select: { status: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } }
        },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (role !== 'ADMIN') {
      const isMember = project.members.some(member => member.userId === userId);
      if (!isMember) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdById: req.user.id,
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: { name, description }
    });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId
      }
    });

    res.status(201).json(member);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId
        }
      }
    });

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
