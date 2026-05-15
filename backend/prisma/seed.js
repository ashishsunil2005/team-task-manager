const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Create Users
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const memberPassword = await bcrypt.hash('Member123!', 10);
  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      name: 'Member User',
      email: 'member@example.com',
      passwordHash: memberPassword,
      role: 'MEMBER',
    },
  });

  const member2Password = await bcrypt.hash('Member456!', 10);
  const member2 = await prisma.user.upsert({
    where: { email: 'member2@example.com' },
    update: {},
    create: {
      name: 'Another Member',
      email: 'member2@example.com',
      passwordHash: member2Password,
      role: 'MEMBER',
    },
  });

  console.log('Users created.');

  // Clean existing data for clean seed
  await prisma.task.deleteMany({});
  await prisma.projectMember.deleteMany({});
  await prisma.project.deleteMany({});

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Overhaul the main corporate website',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id },
          { userId: member.id }
        ]
      }
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App MVP',
      description: 'First version of the mobile application',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id },
          { userId: member2.id }
        ]
      }
    }
  });

  console.log('Projects created.');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Create Tasks for Project 1
  await prisma.task.createMany({
    data: [
      { title: 'Design Homepage', description: 'Create Figma mocks', status: 'TODO', priority: 'HIGH', projectId: project1.id, assignedToId: member.id, createdById: admin.id, dueDate: nextWeek },
      { title: 'Setup Repo', description: 'Initialize React app', status: 'DONE', priority: 'MEDIUM', projectId: project1.id, assignedToId: admin.id, createdById: admin.id },
      { title: 'Implement Auth', description: 'JWT login setup', status: 'IN_PROGRESS', priority: 'HIGH', projectId: project1.id, assignedToId: member.id, createdById: admin.id, dueDate: yesterday }, // Overdue
    ]
  });

  // Create Tasks for Project 2
  await prisma.task.createMany({
    data: [
      { title: 'API Design', description: 'Swagger docs', status: 'TODO', priority: 'MEDIUM', projectId: project2.id, assignedToId: member2.id, createdById: admin.id, dueDate: nextWeek },
      { title: 'Database Schema', description: 'Prisma models', status: 'DONE', priority: 'HIGH', projectId: project2.id, assignedToId: admin.id, createdById: admin.id },
      { title: 'CI/CD Setup', description: 'GitHub Actions', status: 'TODO', priority: 'LOW', projectId: project2.id, createdById: admin.id }, // Unassigned
    ]
  });

  console.log('Tasks created.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
