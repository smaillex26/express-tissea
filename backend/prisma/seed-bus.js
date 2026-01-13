import { PrismaClient } from '@prisma/client';
import prisma from '../src/config/prisma.js';

async function main() {
  console.log('Ajout de la catégorie Bus et des lignes...');

  // Créer la catégorie Bus
  const busCategory = await prisma.category.upsert({
    where: { name: 'Bus' },
    update: {},
    create: {
      name: 'Bus'
    }
  });

  console.log('✓ Catégorie Bus créée:', busCategory);

  // Lignes Linéo avec horaires
  const lineo1 = await prisma.line.create({
    data: {
      name: 'Linéo 1',
      number: 'L1',
      color: '#00A651',
      categoryId: busCategory.id,
      startTime: '05:00',
      endTime: '00:30',
      lineType: 'Bus',
      description: 'Ligne structurante Blagnac - Ramonville'
    }
  });

  const lineo2 = await prisma.line.create({
    data: {
      name: 'Linéo 2',
      number: 'L2',
      color: '#ED1C24',
      categoryId: busCategory.id,
      startTime: '05:00',
      endTime: '00:30',
      lineType: 'Bus',
      description: 'Ligne structurante Fenouillet - Portet'
    }
  });

  const lineo3 = await prisma.line.create({
    data: {
      name: 'Linéo 3',
      number: 'L3',
      color: '#009EE3',
      categoryId: busCategory.id,
      startTime: '05:00',
      endTime: '00:30',
      lineType: 'Bus',
      description: 'Ligne structurante Colomiers - Labège'
    }
  });

  // Navette Aéroport
  const navetteAeroport = await prisma.line.create({
    data: {
      name: 'Navette Aéroport',
      number: 'NAV',
      color: '#FDB913',
      categoryId: busCategory.id,
      startTime: '05:00',
      endTime: '00:15',
      lineType: 'Navette',
      description: 'Navette express Aéroport - Centre-ville'
    }
  });

  console.log('✓ Lignes Bus créées');

  // Créer/récupérer les arrêts et les associer aux lignes

  // Arrêts Linéo 1 (Blagnac - Ramonville)
  const stopsLineo1 = [
    { name: 'Odyssud', latitude: 43.63411, longitude: 1.38689, order: 1 },
    { name: 'Grand Noble', latitude: 43.63178, longitude: 1.39456, order: 2 },
    { name: 'Ancely', latitude: 43.62889, longitude: 1.40123, order: 3 },
    { name: 'Arènes', latitude: 43.61234, longitude: 1.43567, order: 4 },
    { name: 'Jean Jaurès', latitude: 43.60854, longitude: 1.44938, order: 5 },
    { name: 'Marengo SNCF', latitude: 43.60478, longitude: 1.45389, order: 6 },
    { name: 'Rangueil', latitude: 43.56234, longitude: 1.46789, order: 7 },
    { name: 'Faculté de Pharmacie', latitude: 43.55678, longitude: 1.47123, order: 8 }
  ];

  for (const stopData of stopsLineo1) {
    // Try to find existing stop with same name
    let stop = await prisma.stop.findFirst({
      where: { name: stopData.name }
    });

    // If not found, create new stop
    if (!stop) {
      stop = await prisma.stop.create({
        data: {
          name: stopData.name,
          latitude: stopData.latitude,
          longitude: stopData.longitude
        }
      });
    }

    await prisma.lineStop.upsert({
      where: {
        lineId_stopId: {
          lineId: lineo1.id,
          stopId: stop.id
        }
      },
      update: {},
      create: {
        lineId: lineo1.id,
        stopId: stop.id,
        stopOrder: stopData.order
      }
    });
  }

  console.log(`✓ ${stopsLineo1.length} arrêts ajoutés pour Linéo 1`);

  // Arrêts Linéo 2 (Fenouillet - Portet)
  const stopsLineo2 = [
    { name: 'Fenouillet Mairie', latitude: 43.68234, longitude: 1.39456, order: 1 },
    { name: 'Lalande', latitude: 43.65678, longitude: 1.41234, order: 2 },
    { name: 'Barrière de Paris', latitude: 43.62456, longitude: 1.43567, order: 3 },
    { name: 'Jeanne d\'Arc', latitude: 43.60123, longitude: 1.44678, order: 4 },
    { name: 'Empalot', latitude: 43.58456, longitude: 1.45789, order: 5 },
    { name: 'Portet Centre', latitude: 43.52234, longitude: 1.41567, order: 6 }
  ];

  for (const stopData of stopsLineo2) {
    // Try to find existing stop with same name
    let stop = await prisma.stop.findFirst({
      where: { name: stopData.name }
    });

    // If not found, create new stop
    if (!stop) {
      stop = await prisma.stop.create({
        data: {
          name: stopData.name,
          latitude: stopData.latitude,
          longitude: stopData.longitude
        }
      });
    }

    await prisma.lineStop.upsert({
      where: {
        lineId_stopId: {
          lineId: lineo2.id,
          stopId: stop.id
        }
      },
      update: {},
      create: {
        lineId: lineo2.id,
        stopId: stop.id,
        stopOrder: stopData.order
      }
    });
  }

  console.log(`✓ ${stopsLineo2.length} arrêts ajoutés pour Linéo 2`);

  // Arrêts Linéo 3 (Colomiers - Labège)
  const stopsLineo3 = [
    { name: 'Colomiers Gare', latitude: 43.61234, longitude: 1.33456, order: 1 },
    { name: 'Purpan', latitude: 43.60789, longitude: 1.38567, order: 2 },
    { name: 'Matabiau', latitude: 43.61123, longitude: 1.45456, order: 3 },
    { name: 'Cours Dillon', latitude: 43.60234, longitude: 1.46789, order: 4 },
    { name: 'Labège Village', latitude: 43.54123, longitude: 1.52456, order: 5 }
  ];

  for (const stopData of stopsLineo3) {
    // Try to find existing stop with same name
    let stop = await prisma.stop.findFirst({
      where: { name: stopData.name }
    });

    // If not found, create new stop
    if (!stop) {
      stop = await prisma.stop.create({
        data: {
          name: stopData.name,
          latitude: stopData.latitude,
          longitude: stopData.longitude
        }
      });
    }

    await prisma.lineStop.upsert({
      where: {
        lineId_stopId: {
          lineId: lineo3.id,
          stopId: stop.id
        }
      },
      update: {},
      create: {
        lineId: lineo3.id,
        stopId: stop.id,
        stopOrder: stopData.order
      }
    });
  }

  console.log(`✓ ${stopsLineo3.length} arrêts ajoutés pour Linéo 3`);

  // Arrêts Navette Aéroport
  const stopsNavette = [
    { name: 'Aéroport Toulouse-Blagnac', latitude: 43.62911, longitude: 1.36378, order: 1 },
    { name: 'Compans Caffarelli', latitude: 43.61089, longitude: 1.43478, order: 2 },
    { name: 'Gare Matabiau', latitude: 43.61123, longitude: 1.45456, order: 3 }
  ];

  for (const stopData of stopsNavette) {
    // Try to find existing stop with same name
    let stop = await prisma.stop.findFirst({
      where: { name: stopData.name }
    });

    // If not found, create new stop
    if (!stop) {
      stop = await prisma.stop.create({
        data: {
          name: stopData.name,
          latitude: stopData.latitude,
          longitude: stopData.longitude
        }
      });
    }

    await prisma.lineStop.upsert({
      where: {
        lineId_stopId: {
          lineId: navetteAeroport.id,
          stopId: stop.id
        }
      },
      update: {},
      create: {
        lineId: navetteAeroport.id,
        stopId: stop.id,
        stopOrder: stopData.order
      }
    });
  }

  console.log(`✓ ${stopsNavette.length} arrêts ajoutés pour Navette Aéroport`);
  console.log('\n✅ Seed Bus terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
