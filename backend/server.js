import createApp from './app.js';
import pool from './config/database.js';
import migrationManager from './config/migrations.js';

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await migrationManager.runMigrations();
    
    const client = await pool.connect();
    client.release();

    const app = createApp();
    
     const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    const gracefulShutdown = (signal) => {
        server.close(() => {
            pool.end(() => {
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
