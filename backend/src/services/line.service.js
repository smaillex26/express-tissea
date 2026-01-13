import prisma from '../config/prisma.js';
import { calculateDistance } from '../utils/distance.js';

export const getAllLines = async () => {
  const lines = await prisma.line.findMany({
    include: {
      category: {
        select: {
          name: true
        }
      },
      lineStops: true
    },
    orderBy: [
      {
        category: {
          name: 'asc'
        }
      },
      {
        number: 'asc'
      }
    ]
  });

  return lines.map(line => ({
    id: line.id,
    name: line.name,
    number: line.number,
    color: line.color,
    categoryId: line.categoryId,
    category: line.category.name,
    startTime: line.startTime,
    endTime: line.endTime,
    lineType: line.lineType,
    description: line.description,
    stopsCount: line.lineStops.length,
    createdAt: line.createdAt
  }));
};

export const getLineById = async (lineId) => {
  const line = await prisma.line.findUnique({
    where: { id: parseInt(lineId) },
    include: {
      category: {
        select: {
          name: true
        }
      },
      lineStops: {
        include: {
          stop: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          stopOrder: 'asc'
        }
      }
    }
  });

  if (!line) {
    throw new Error('Ligne non trouvée');
  }

  return {
    id: line.id,
    name: line.name,
    number: line.number,
    color: line.color,
    category: line.category.name,
    startTime: line.startTime,
    endTime: line.endTime,
    createdAt: line.createdAt,
    stops: line.lineStops.map(ls => ls.stop.name)
  };
};

export const getLineStops = async (lineId) => {
  const lineStops = await prisma.lineStop.findMany({
    where: { lineId: parseInt(lineId) },
    include: {
      stop: true
    },
    orderBy: {
      stopOrder: 'asc'
    }
  });

  if (lineStops.length === 0) {
    // Check if line exists
    const line = await prisma.line.findUnique({
      where: { id: parseInt(lineId) }
    });
    if (!line) {
      throw new Error('Ligne non trouvée');
    }
  }

  return lineStops.map(ls => ({
    id: ls.stop.id,
    name: ls.stop.name,
    latitude: parseFloat(ls.stop.latitude.toString()),
    longitude: parseFloat(ls.stop.longitude.toString()),
    order: ls.stopOrder
  }));
};

export const updateLine = async (lineId, data) => {
  const updateData = {};

  if (data.name) updateData.name = data.name;
  if (data.number) updateData.number = data.number;
  if (data.color) updateData.color = data.color;
  if (data.startTime) updateData.startTime = data.startTime;
  if (data.endTime) updateData.endTime = data.endTime;

  if (Object.keys(updateData).length === 0) {
    throw new Error('Aucune donnée à mettre à jour');
  }

  try {
    const updatedLine = await prisma.line.update({
      where: { id: parseInt(lineId) },
      data: updateData
    });

    return updatedLine;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Ligne non trouvée');
    }
    throw error;
  }
};

export const addStopToLine = async (lineId, stopData) => {
  return await prisma.$transaction(async (tx) => {
    // Check if line exists
    const line = await tx.line.findUnique({
      where: { id: parseInt(lineId) }
    });

    if (!line) {
      throw new Error('Ligne non trouvée');
    }

    // Get next order number
    const maxOrder = await tx.lineStop.aggregate({
      where: { lineId: parseInt(lineId) },
      _max: { stopOrder: true }
    });
    const nextOrder = (maxOrder._max.stopOrder || 0) + 1;

    // Create stop
    const stop = await tx.stop.create({
      data: {
        name: stopData.name,
        latitude: stopData.latitude,
        longitude: stopData.longitude
      }
    });

    // Link stop to line
    await tx.lineStop.create({
      data: {
        lineId: parseInt(lineId),
        stopId: stop.id,
        stopOrder: nextOrder
      }
    });

    return {
      id: stop.id,
      name: stop.name,
      latitude: parseFloat(stop.latitude.toString()),
      longitude: parseFloat(stop.longitude.toString()),
      order: nextOrder
    };
  });
};

export const removeStopFromLine = async (lineId, stopId) => {
  return await prisma.$transaction(async (tx) => {
    // Delete line_stop
    const deleted = await tx.lineStop.deleteMany({
      where: {
        lineId: parseInt(lineId),
        stopId: parseInt(stopId)
      }
    });

    if (deleted.count === 0) {
      throw new Error('Arrêt non trouvé sur cette ligne');
    }

    // Get remaining stops and reorder them
    const remainingStops = await tx.lineStop.findMany({
      where: { lineId: parseInt(lineId) },
      orderBy: { stopOrder: 'asc' }
    });

    // Update the order of remaining stops
    for (let i = 0; i < remainingStops.length; i++) {
      await tx.lineStop.update({
        where: { id: remainingStops[i].id },
        data: { stopOrder: i + 1 }
      });
    }

    return { message: 'Arrêt supprimé et ordre réorganisé' };
  });
};

export const calculateLineDistance = async (lineId) => {
  const stops = await getLineStops(lineId);

  if (stops.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 0; i < stops.length - 1; i++) {
    const distance = calculateDistance(
      stops[i].latitude,
      stops[i].longitude,
      stops[i + 1].latitude,
      stops[i + 1].longitude
    );
    totalDistance += distance;
  }

  return Math.round(totalDistance * 100) / 100;
};
