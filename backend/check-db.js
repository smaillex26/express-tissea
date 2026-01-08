import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Categories:', categories);

  const lines = await prisma.line.findMany();
  console.log('Lines:', lines);

  await prisma.$disconnect();
}

main();
