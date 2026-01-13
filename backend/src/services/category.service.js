import prisma from '../config/prisma.js';

export const getLinesByCategory = async (categoryId) => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) }
  });

  if (!category) {
    throw new Error('Catégorie non trouvée');
  }

  // Get lines for this category
  const lines = await prisma.line.findMany({
    where: { categoryId: parseInt(categoryId) },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      number: 'asc'
    }
  });

  return lines.map(line => ({
    id: line.id,
    name: line.name,
    number: line.number,
    color: line.color,
    categoryId: line.categoryId,
    category: line.category,
    startTime: line.startTime,
    endTime: line.endTime,
    lineType: line.lineType,
    description: line.description,
    createdAt: line.createdAt
  }));
};
