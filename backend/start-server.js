import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API Documentation: http://localhost:${PORT}/`);
  console.log(`Press CTRL+C to stop`);
});

// Keep process alive with heartbeat
const heartbeat = setInterval(() => {
  // This keeps the event loop active
}, 1000000);

// Graceful shutdown
const shutdown = () => {
  console.log('\nShutting down gracefully...');
  clearInterval(heartbeat);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
