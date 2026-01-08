import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function initDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔧 Initializing database...');
    console.log(`📍 Database: ${poolConfig.database || 'from DATABASE_URL'}`);

    // Read and execute schema.sql
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf-8');

    console.log('\n📋 Executing schema.sql...');
    await client.query(schemaSql);

    console.log('✅ Database schema created successfully!');
    console.log('\n📊 Tables created:');
    console.log('   - users');
    console.log('   - categories');
    console.log('   - lines');
    console.log('   - stops');
    console.log('   - line_stops');

    console.log('\n💡 Next step: Run "npm run seed" to populate the database with Tisséo data');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase()
  .then(() => {
    console.log('\n🎉 Database initialization completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database initialization failed:', error);
    process.exit(1);
  });
