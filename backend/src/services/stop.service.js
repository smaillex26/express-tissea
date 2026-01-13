import prisma from '../config/prisma.js';

export const getAllStops = async () => {
  const stops = await prisma.stop.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return stops.map(stop => ({
    id: stop.id,
    name: stop.name,
    latitude: parseFloat(stop.latitude.toString()),
    longitude: parseFloat(stop.longitude.toString())
  }));
};
