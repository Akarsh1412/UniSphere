import http from 'http';
import { Server } from 'socket.io';
import createApp from './app.js';
import pool from './config/database.js';
import migrationManager from './config/migrations.js';
import initializeSocket from './socket/socketHandler.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('Starting UniSphere Backend Server...');
    
    await migrationManager.runMigrations();
    
    const client = await pool.connect();
    console.log('✅ Connected to Aiven PostgreSQL database');
    client.release();

    const app = createApp();
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.FRONTEND_URL 
          : ['http://localhost:5173', 'http://localhost:5174'],
        methods: ["GET", "POST", "PUT", "DELETE"]
      }
    });
    
    app.set('io', io);
    initializeSocket(io);
    
    server.listen(PORT, () => {
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
