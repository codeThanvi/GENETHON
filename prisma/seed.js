const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  // 1. Seed Users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: 'hashedPassword123', // Use a real hash in production
        role: i % 2 === 0 ? 'EMPLOYEE' : 'ADMIN',
        name: faker.name.fullName(),
      },
    });
    users.push(user);
  }

  // 2. Seed Call Logs for Each User
  for (const user of users) {
    for (let j = 0; j < 3; j++) { // 3 calls per user
      await prisma.callLog.create({
        data: {
          employeeId: user.id,
          employeeUsername: user.username,
          phoneNumber: faker.phone.number('+1-###-###-####'),
          callType: j % 2 === 0 ? 'INCOMING' : 'OUTGOING',
          duration: faker.number.int({ min: 30, max: 3600 }), // Call duration in seconds
          sentiment: faker.helpers.arrayElement(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
          transcript: faker.lorem.sentences(3),
          audioUrl: faker.internet.url(),
        },
      });
    }
  }
  
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
