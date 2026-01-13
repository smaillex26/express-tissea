import prisma from '../config/prisma.js';
import { calculateDistance } from '../utils/distance.js';

export const getDistanceBetweenStops = async (stopId1, stopId2) => {
  const stop1 = await prisma.stop.findUnique({
    where: { id: parseInt(stopId1) }
  });

  const stop2 = await prisma.stop.findUnique({
    where: { id: parseInt(stopId2) }
  });

  if (!stop1 || !stop2) {
    throw new Error('Un ou plusieurs arrêts non trouvés');
  }

  const distance = calculateDistance(
    parseFloat(stop1.latitude.toString()),
    parseFloat(stop1.longitude.toString()),
    parseFloat(stop2.latitude.toString()),
    parseFloat(stop2.longitude.toString())
  );

  return {
    stop1: {
      id: stop1.id,
      name: stop1.name,
      latitude: parseFloat(stop1.latitude.toString()),
      longitude: parseFloat(stop1.longitude.toString())
    },
    stop2: {
      id: stop2.id,
      name: stop2.name,
      latitude: parseFloat(stop2.latitude.toString()),
      longitude: parseFloat(stop2.longitude.toString())
    },
    distance: distance
  };
};

export const getGeneralStats = async () => {
  const categoriesCount = await prisma.category.count();
  const linesCount = await prisma.line.count();
  const stopsCount = await prisma.stop.count();
  const lineStopsCount = await prisma.lineStop.count();

  return {
    categories: categoriesCount,
    lines: linesCount,
    stops: stopsCount,
    relations: lineStopsCount
  };
};
