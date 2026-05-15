const prisma = require('../utils/prismaClient');

const getDashboardStats = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let projectCount = 0;
    let tasks = [];
    let projects = [];

    if (role === 'ADMIN') {
      projectCount = await prisma.project.count();
      tasks = await prisma.task.findMany({
        include: { project: { select: { name: true } } }
      });
      projects = await prisma.project.findMany({
        include: {
          tasks: { select: { status: true } }
        }
      });
    } else {
      const memberProjects = await prisma.projectMember.findMany({
        where: { userId },
        select: { projectId: true }
      });
      const projectIds = memberProjects.map(p => p.projectId);
      projectCount = projectIds.length;

      tasks = await prisma.task.findMany({
        where: { assignedToId: userId },
        include: { project: { select: { name: true } } }
      });

      projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        include: {
          tasks: { select: { status: true } }
        }
      });
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'DONE').length;
    const pendingTasks = tasks.filter(t => t.status === 'TODO').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = tasks.filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < today);

    const recentTasks = tasks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

    const projectProgress = projects.map(p => {
      const total = p.tasks.length;
      const completed = p.tasks.filter(t => t.status === 'DONE').length;
      return {
        id: p.id,
        name: p.name,
        progress: total === 0 ? 0 : Math.round((completed / total) * 100)
      };
    });

    res.status(200).json({
      totalProjects: projectCount,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasksCount: overdueTasks.length,
      overdueTasks,
      recentTasks,
      projectProgress
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDashboardStats };
