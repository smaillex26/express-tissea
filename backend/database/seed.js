import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Database connection
let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'tissea_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
}

const pool = new Pool(poolConfig);

// Coordonnées approximatives pour les arrêts principaux de Toulouse
const stopCoordinates = {
  // Arrêts principaux
  'Arènes': { lat: 43.6097, lon: 1.3887 },
  'Basso Cambo': { lat: 43.5835, lon: 1.4089 },
  'Borderouge': { lat: 43.6356, lon: 1.4419 },
  'Balma-Gramont': { lat: 43.6264, lon: 1.4967 },
  'Jean Jaurès': { lat: 43.6068, lon: 1.4483 },
  'Capitole': { lat: 43.6045, lon: 1.4442 },
  'Compans Caffarelli': { lat: 43.6086, lon: 1.4328 },
  'Marengo SNCF': { lat: 43.6024, lon: 1.4579 },
  'Empalot': { lat: 43.5838, lon: 1.4366 },
  'Ramonville': { lat: 43.5476, lon: 1.4730 },
  'Colomiers Gare SNCF': { lat: 43.6119, lon: 1.3382 },
  'Rangueil': { lat: 43.5661, lon: 1.4631 },
  'Argoulets': { lat: 43.6235, lon: 1.4741 },
  'La Vache': { lat: 43.6226, lon: 1.4362 },
  'St Cyprien République': { lat: 43.6034, lon: 1.4317 },
  'Université Paul Sabatier': { lat: 43.5610, lon: 1.4645 },
  'Jeanne d\'Arc': { lat: 43.6079, lon: 1.4419 },
  'François Verdier': { lat: 43.6054, lon: 1.4554 },
  'Portet Gare SNCF': { lat: 43.5238, lon: 1.4115 },
  'Muret Gare SNCF': { lat: 43.4629, lon: 1.3277 },
  'Colomiers Centre': { lat: 43.6092, lon: 1.3433 },
  'Tournefeuille Centre': { lat: 43.5853, lon: 1.3460 },
  'Castanet-Tolosan': { lat: 43.5179, lon: 1.5017 },
  'L\'Union Mairie': { lat: 43.6536, lon: 1.4818 },
  'Sept Deniers': { lat: 43.6300, lon: 1.4250 },
  'Plaisance Monestié': { lat: 43.5645, lon: 1.3325 },
  'Cours Dillon': { lat: 43.4974, lon: 1.3986 },
  'Fonsegrives Entiore': { lat: 43.5926, lon: 1.5411 },
  'Colomiers Lycée International': { lat: 43.6048, lon: 1.3165 },
  'Fenouillet Centre Commercial': { lat: 43.6808, lon: 1.4039 },
  'Aéroport Toulouse-Blagnac': { lat: 43.6290, lon: 1.3638 },
  'Gonin': { lat: 43.5551, lon: 1.4791 },
  'St-Orens Centre Commercial': { lat: 43.5547, lon: 1.5274 },
  'Oncopole': { lat: 43.6180, lon: 1.4175 },
  'Frouzins Complexe Sportif': { lat: 43.5211, lon: 1.3254 },
  'Tournefeuille Lycée': { lat: 43.5800, lon: 1.3380 },
  'Trois Cocus': { lat: 43.6400, lon: 1.4500 },
  'Barrière de Paris': { lat: 43.6200, lon: 1.4400 },
  'Minimes Claude Nougaro': { lat: 43.6150, lon: 1.4350 },
  'Canal du Midi': { lat: 43.6100, lon: 1.4380 },
  'Carmes': { lat: 43.5980, lon: 1.4450 },
  'Palais de Justice': { lat: 43.5950, lon: 1.4420 },
  'St Michel Marcel Langer': { lat: 43.5900, lon: 1.4400 },
  'St Agne SNCF': { lat: 43.5750, lon: 1.4500 },
  'Saouzelong': { lat: 43.5700, lon: 1.4550 },
  'Faculté de Pharmacie': { lat: 43.5630, lon: 1.4620 },
  'Patte d\'Oie': { lat: 43.6000, lon: 1.4250 },
  'Esquirol': { lat: 43.6020, lon: 1.4420 },
  'Jolimont': { lat: 43.6150, lon: 1.4650 },
  'Roseraie': { lat: 43.6200, lon: 1.4700 },
  'Bellefontaine': { lat: 43.5900, lon: 1.4100 },
  'Reynerie': { lat: 43.5850, lon: 1.4050 },
  'Mirail Université': { lat: 43.5800, lon: 1.4000 },
  'Bagatelle': { lat: 43.5850, lon: 1.3950 },
  'Mermoz': { lat: 43.5900, lon: 1.3900 },
};

// Fonction helper pour obtenir des coordonnées (avec fallback)
function getCoords(stopName) {
  if (stopCoordinates[stopName]) {
    return stopCoordinates[stopName];
  }
  // Coordonnées par défaut dans Toulouse
  return {
    lat: 43.6047 + (Math.random() - 0.5) * 0.1,
    lon: 1.4442 + (Math.random() - 0.5) * 0.1
  };
}

// Données des lignes Linéo
const lineoLines = [
  {
    number: 'L1',
    name: 'Linéo 1',
    color: '#E2001A',
    description: 'Sept Deniers Salvador Dali ↔ Fonsegrives Entiore',
    stops: ['Sept Deniers', 'Ch. Lully', 'Soleil d\'Or', 'Cité Madrid', 'Fourmi', 'Suisse',
            'Ponts Jumeaux', 'Canal de Brienne', 'Leclerc Héraclès', 'Leclerc Barcelone',
            'Caffarelli', 'Compans', 'A. Bernard', 'Concorde', 'Jeanne d\'Arc', 'Jean Jaurès',
            'St-Georges', 'François Verdier', 'Place Dupuy', 'Aqueduc', 'Pérignon', 'Tilleuls',
            'Deltour', 'Achiary', 'Mascard', 'Aubisque', 'Cité de l\'Hers', 'Collège JP Vernant',
            'Gymnase de L\'Hers', 'Aérodrome', 'Collège Monge', 'Médiathèque', 'Ribaute',
            'Lasbordes', 'Balma-Gramont', 'Quint Centre', 'Fonsegrives Entiore']
  },
  {
    number: 'L2',
    name: 'Linéo 2',
    color: '#008C95',
    description: 'Arènes ↔ Colomiers Lycée International',
    stops: ['Arènes', 'Cartoucherie', 'Fontaine Lestang', 'Route d\'Albi', 'Roseraie',
            'Purpan Arènes', 'Purpan Ancely', 'La Cadène', 'Rotonde', 'Airbus Defence & Space',
            'Leclerc Esplanade', 'Colomiers Centre', 'Victor Hugo', 'Mairie', 'Perget Gare',
            'Colomiers Lycée International']
  },
  {
    number: 'L3',
    name: 'Linéo 3',
    color: '#F39200',
    description: 'Arènes ↔ Plaisance Monestié',
    stops: ['Arènes', 'Arc en Ciel', 'Gascogne', 'Garonne', 'Langlade', 'Fer à Cheval',
            'Basso Cambo', 'Bachecame Petit Jean', 'Route de Tarbes', 'Lamarck', 'Rivière Basse',
            'Prat Dessus', 'Meyssard', 'Pech David', 'Plaisance Ritouret', 'Plaisance Monestié']
  },
  {
    number: 'L4',
    name: 'Linéo 4',
    color: '#A3479D',
    description: 'Basso Cambo ↔ Cours Dillon',
    stops: ['Basso Cambo', 'Croix de Pierre', 'Empalot', 'Casselardit', 'Portet', 'Roques', 'Cours Dillon']
  },
  {
    number: 'L5',
    name: 'Linéo 5',
    color: '#62AA3C',
    description: 'Arènes ↔ Tournefeuille Lycée',
    stops: ['Arènes', 'Cartoucherie', 'Fontaine Lestang', 'Route d\'Albi', 'Roseraie',
            'Purpan Arènes', 'Ramelet Moundi', 'Tournefeuille Centre', 'Tournefeuille Lycée']
  },
  {
    number: 'L6',
    name: 'Linéo 6',
    color: '#965092',
    description: 'Arènes ↔ Castanet-Tolosan',
    stops: ['Arènes', 'Jeanne d\'Arc', 'Jean Jaurès', 'François Verdier', 'Rangueil', 'Université Paul Sabatier',
            'Ramonville', 'Castanet-Tolosan']
  },
  {
    number: 'L7',
    name: 'Linéo 7',
    color: '#00AEEF',
    description: 'Borderouge ↔ Empalot',
    stops: ['Borderouge', 'La Vache', 'Compans Caffarelli', 'Jean Jaurès', 'Capitole', 'St Cyprien République',
            'Basso Cambo', 'Empalot']
  },
  {
    number: 'L8',
    name: 'Linéo 8',
    color: '#E6007E',
    description: 'Argoulets ↔ St Cyprien République',
    stops: ['Argoulets', 'Marengo SNCF', 'Jean Jaurès', 'Capitole', 'St Cyprien République']
  },
  {
    number: 'L9',
    name: 'Linéo 9',
    color: '#FDB913',
    description: 'Borderouge ↔ Basso Cambo',
    stops: ['Borderouge', 'Compans Caffarelli', 'Jean Jaurès', 'Capitole', 'St Cyprien République', 'Basso Cambo']
  },
  {
    number: 'L10',
    name: 'Linéo 10',
    color: '#9B2743',
    description: 'L\'Union Mairie ↔ Oncopole',
    stops: ['L\'Union Mairie', 'Borderouge', 'La Vache', 'Compans Caffarelli', 'Jean Jaurès', 'Capitole',
            'St Cyprien République', 'Oncopole']
  },
  {
    number: 'L11',
    name: 'Linéo 11',
    color: '#00A651',
    description: 'Fenouillet Centre Commercial ↔ Ramonville',
    stops: ['Fenouillet Centre Commercial', 'Borderouge', 'Compans Caffarelli', 'Jean Jaurès', 'François Verdier',
            'Rangueil', 'Université Paul Sabatier', 'Ramonville']
  },
  {
    number: 'L12',
    name: 'Linéo 12',
    color: '#8D5B2D',
    description: 'Balma-Gramont ↔ St-Orens Centre Commercial',
    stops: ['Balma-Gramont', 'Argoulets', 'Marengo SNCF', 'Jean Jaurès', 'François Verdier', 'Gonin',
            'St-Orens Centre Commercial']
  },
  {
    number: 'L13',
    name: 'Linéo 13',
    color: '#0066B3',
    description: 'Colomiers Gare SNCF ↔ Aéroport Toulouse-Blagnac',
    stops: ['Colomiers Gare SNCF', 'Colomiers Centre', 'Aéroport Toulouse-Blagnac']
  }
];

// Données des lignes de Métro
const metroLines = [
  {
    number: 'A',
    name: 'Métro A',
    color: '#E2001A',
    lineType: 'Métro',
    description: 'Basso Cambo ↔ Balma-Gramont',
    stops: ['Basso Cambo', 'Bellefontaine', 'Reynerie', 'Mirail Université', 'Bagatelle', 'Mermoz',
            'Fontaine Lestang', 'Arènes', 'Patte d\'Oie', 'St Cyprien République', 'Esquirol',
            'Capitole', 'Jean Jaurès', 'Marengo SNCF', 'Jolimont', 'Roseraie', 'Argoulets', 'Balma-Gramont']
  },
  {
    number: 'B',
    name: 'Métro B',
    color: '#FDB913',
    lineType: 'Métro',
    description: 'Borderouge ↔ Ramonville',
    stops: ['Borderouge', 'Trois Cocus', 'La Vache', 'Barrière de Paris', 'Minimes Claude Nougaro',
            'Canal du Midi', 'Compans Caffarelli', 'Jeanne d\'Arc', 'Jean Jaurès', 'François Verdier',
            'Carmes', 'Palais de Justice', 'St Michel Marcel Langer', 'Empalot', 'St Agne SNCF',
            'Saouzelong', 'Rangueil', 'Faculté de Pharmacie', 'Université Paul Sabatier', 'Ramonville']
  }
];

// Données des lignes de bus classiques
const busLines = [
  {
    number: '1',
    name: 'Bus 1',
    color: '#E2001A',
    lineType: 'Bus',
    description: 'Arènes ↔ Balma-Gramont',
    stops: ['Arènes', 'Jeanne d\'Arc', 'Jean Jaurès', 'Compans Caffarelli', 'Argoulets', 'Balma-Gramont']
  },
  {
    number: '2',
    name: 'Bus 2',
    color: '#008C95',
    lineType: 'Bus',
    description: 'Borderouge ↔ Ramonville',
    stops: ['Borderouge', 'Compans Caffarelli', 'Jean Jaurès', 'François Verdier', 'Rangueil', 'Ramonville']
  },
  {
    number: '10',
    name: 'Bus 10',
    color: '#F39200',
    lineType: 'Bus',
    description: 'Jean Jaurès ↔ Colomiers Centre',
    stops: ['Jean Jaurès', 'Capitole', 'Arènes', 'Purpan Arènes', 'Colomiers Centre']
  },
  {
    number: '14',
    name: 'Bus 14',
    color: '#A3479D',
    lineType: 'Bus',
    description: 'Arènes ↔ Argoulets',
    stops: ['Arènes', 'Jeanne d\'Arc', 'Jean Jaurès', 'Compans Caffarelli', 'Argoulets']
  },
  {
    number: '23',
    name: 'Bus 23',
    color: '#62AA3C',
    lineType: 'Bus',
    description: 'Basso Cambo ↔ Empalot',
    stops: ['Basso Cambo', 'St Cyprien République', 'Capitole', 'Jean Jaurès', 'François Verdier', 'Empalot']
  },
  {
    number: '27',
    name: 'Bus 27',
    color: '#965092',
    lineType: 'Bus',
    description: 'Arènes ↔ Tournefeuille Centre',
    stops: ['Arènes', 'Purpan Arènes', 'Tournefeuille Centre']
  },
  {
    number: '34',
    name: 'Bus 34',
    color: '#00AEEF',
    lineType: 'Bus',
    description: 'Jean Jaurès ↔ Rangueil',
    stops: ['Jean Jaurès', 'François Verdier', 'Rangueil']
  },
  {
    number: '36',
    name: 'Bus 36',
    color: '#E6007E',
    lineType: 'Bus',
    description: 'Basso Cambo ↔ Portet Gare SNCF',
    stops: ['Basso Cambo', 'Empalot', 'Portet Gare SNCF']
  },
  {
    number: '38',
    name: 'Bus 38',
    color: '#FDB913',
    lineType: 'Bus',
    description: 'Arènes ↔ Borderouge',
    stops: ['Arènes', 'Jeanne d\'Arc', 'Jean Jaurès', 'Compans Caffarelli', 'La Vache', 'Borderouge']
  },
  {
    number: '41',
    name: 'Bus 41',
    color: '#9B2743',
    lineType: 'Bus',
    description: 'Jean Jaurès ↔ Balma-Gramont',
    stops: ['Jean Jaurès', 'Marengo SNCF', 'Argoulets', 'Balma-Gramont']
  },
  {
    number: '45',
    name: 'Bus 45',
    color: '#00A651',
    lineType: 'Bus',
    description: 'Borderouge ↔ L\'Union Mairie',
    stops: ['Borderouge', 'L\'Union Mairie']
  },
  {
    number: '52',
    name: 'Bus 52',
    color: '#8D5B2D',
    lineType: 'Bus',
    description: 'Jean Jaurès ↔ Ramonville',
    stops: ['Jean Jaurès', 'François Verdier', 'Rangueil', 'Université Paul Sabatier', 'Ramonville']
  },
  {
    number: '78',
    name: 'Bus 78',
    color: '#0066B3',
    lineType: 'Bus',
    description: 'Arènes ↔ Colomiers Lycée International',
    stops: ['Arènes', 'Purpan Arènes', 'Colomiers Centre', 'Colomiers Lycée International']
  }
];

// Ligne Express
const expressLines = [
  {
    number: '100',
    name: 'Express 100',
    color: '#000000',
    lineType: 'Express',
    description: 'Toulouse ↔ Muret Express',
    stops: ['Capitole', 'Jean Jaurès', 'Empalot', 'Portet Gare SNCF', 'Muret Gare SNCF']
  }
];

// Navettes
const navetteLines = [
  {
    number: 'NAV A',
    name: 'Navette Aéroport',
    color: '#FDB913',
    lineType: 'Navette',
    description: 'Jean Jaurès ↔ Aéroport Toulouse-Blagnac',
    stops: ['Jean Jaurès', 'Compans Caffarelli', 'Purpan Arènes', 'Aéroport Toulouse-Blagnac']
  },
  {
    number: 'NAV C',
    name: 'Navette Centre',
    color: '#965092',
    lineType: 'Navette',
    description: 'Circuit centre-ville',
    stops: ['Capitole', 'Jean Jaurès', 'Jeanne d\'Arc', 'St Cyprien République']
  }
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🌱 Starting seed...');

    // 1. Create categories
    console.log('Creating categories...');
    const categoriesData = [
      { name: 'Métro' },
      { name: 'Linéo' },
      { name: 'Bus' },
      { name: 'Express' },
      { name: 'Navette' }
    ];

    const categories = {};
    for (const cat of categoriesData) {
      const result = await client.query(
        'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id, name',
        [cat.name]
      );
      categories[cat.name] = result.rows[0].id;
      console.log(`✓ Category ${cat.name} created with ID ${categories[cat.name]}`);
    }

    // Helper function to create a line with its stops
    async function createLineWithStops(lineData, categoryName) {
      const categoryId = categories[categoryName];

      // Create line
      const lineResult = await client.query(
        'INSERT INTO lines (name, number, color, category_id, start_time, end_time, line_type, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [
          lineData.name,
          lineData.number,
          lineData.color,
          categoryId,
          '05:00',
          '00:30',
          lineData.lineType || categoryName,
          lineData.description
        ]
      );
      const lineId = lineResult.rows[0].id;
      console.log(`  ✓ Line ${lineData.number} created`);

      // Create stops and link them to the line
      for (let i = 0; i < lineData.stops.length; i++) {
        const stopName = lineData.stops[i];
        const coords = getCoords(stopName);

        // Try to find existing stop or create new one
        let stopResult = await client.query(
          'SELECT id FROM stops WHERE name = $1',
          [stopName]
        );

        let stopId;
        if (stopResult.rows.length > 0) {
          stopId = stopResult.rows[0].id;
        } else {
          stopResult = await client.query(
            'INSERT INTO stops (name, latitude, longitude) VALUES ($1, $2, $3) RETURNING id',
            [stopName, coords.lat, coords.lon]
          );
          stopId = stopResult.rows[0].id;
        }

        // Link stop to line
        await client.query(
          'INSERT INTO line_stops (line_id, stop_id, stop_order) VALUES ($1, $2, $3)',
          [lineId, stopId, i + 1]
        );
      }

      console.log(`  ✓ ${lineData.stops.length} stops added to line ${lineData.number}`);
    }

    // 2. Create Métro lines
    console.log('\nCreating Métro lines...');
    for (const line of metroLines) {
      await createLineWithStops(line, 'Métro');
    }

    // 3. Create Linéo lines
    console.log('\nCreating Linéo lines...');
    for (const line of lineoLines) {
      await createLineWithStops(line, 'Linéo');
    }

    // 4. Create Bus lines
    console.log('\nCreating Bus lines...');
    for (const line of busLines) {
      await createLineWithStops(line, 'Bus');
    }

    // 5. Create Express lines
    console.log('\nCreating Express lines...');
    for (const line of expressLines) {
      await createLineWithStops(line, 'Express');
    }

    // 6. Create Navette lines
    console.log('\nCreating Navette lines...');
    for (const line of navetteLines) {
      await createLineWithStops(line, 'Navette');
    }

    await client.query('COMMIT');

    // Display statistics
    const statsResult = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM categories) as categories_count,
        (SELECT COUNT(*) FROM lines) as lines_count,
        (SELECT COUNT(*) FROM stops) as stops_count,
        (SELECT COUNT(*) FROM line_stops) as line_stops_count
    `);

    const stats = statsResult.rows[0];
    console.log('\n✅ Seed completed successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   - Categories: ${stats.categories_count}`);
    console.log(`   - Lines: ${stats.lines_count}`);
    console.log(`   - Stops: ${stats.stops_count}`);
    console.log(`   - Line-Stop relations: ${stats.line_stops_count}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed()
  .then(() => {
    console.log('\n🎉 Seed process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seed process failed:', error);
    process.exit(1);
  });
