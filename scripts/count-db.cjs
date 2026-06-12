const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    customers: await prisma.customer.count(),
    leads: await prisma.lead.count(),
    conversations: await prisma.conversation.count(),
    messages: await prisma.message.count(),
  };
  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
