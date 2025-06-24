import createApp from './app.js';
import pool from './config/database.js';
import migrationManager from './config/migrations.js';

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    console.log('Starting UniSphere Backend Server...');
    
    await migrationManager.runMigrations();
    
    const client = await pool.connect();
    console.log('✅ Connected to Aiven PostgreSQL database');
    client.release();

    const app = createApp();
    
     const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🎉 UniSphere Backend is ready!');
    });
    
    const gracefulShutdown = (signal) => {
        console.log(`Received ${signal}. Starting graceful shutdown...`);
        server.close(() => {
            console.log('HTTP server closed.');
            pool.end(() => {
                console.log('Database connection pool closed.');
                process.exit(0);
            });
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
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
