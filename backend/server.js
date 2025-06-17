import app from './app.js';
import pool from './config/database.js';
import migrationManager from './config/migrations.js';

const PORT = process.env.PORT || 5000;

const gracefulShutdown = (signal, server) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed.');
    
    pool.end(() => {
      console.log('Database connection pool closed.');
      process.exit(0);
    });
  });
  
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

const startServer = async () => {
  try {
    console.log('Starting UniSphere Backend Server...');
    
    const client = await pool.connect();
    console.log('Connected to Aiven PostgreSQL database');
    client.release();
    
    await migrationManager.runMigrations();
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`API docs: http://localhost:${PORT}/api`);
      console.log('UniSphere Backend is ready!');
    });
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM', server));
    process.on('SIGINT', () => gracefulShutdown('SIGINT', server));
    
    return server;
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
