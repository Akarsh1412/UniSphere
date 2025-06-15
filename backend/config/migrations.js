import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MigrationManager {
  constructor() {
    this.migrationsPath = path.join(__dirname, '../migrations');
  }

  async createMigrationsTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Migrations table ready');
    } catch (error) {
      // Handle sequence already exists error
      if (error.code === '23505' && error.detail?.includes('migrations_id_seq')) {
        console.log('⚠️  Migrations sequence already exists, continuing...');
        // Try to create table without sequence
        await pool.query(`
          CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY DEFAULT nextval('migrations_id_seq'),
            filename VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
      } else {
        throw error;
      }
    }
  }

  async getExecutedMigrations() {
    const result = await pool.query('SELECT filename FROM migrations ORDER BY id');
    return result.rows.map(row => row.filename);
  }

  async runMigrations() {
    try {
      await this.createMigrationsTable();
      
      const executedMigrations = await this.getExecutedMigrations();
      
      // Check if migrations directory exists
      if (!fs.existsSync(this.migrationsPath)) {
        console.log('📁 Creating migrations directory...');
        fs.mkdirSync(this.migrationsPath, { recursive: true });
      }
      
      const migrationFiles = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();

      if (migrationFiles.length === 0) {
        console.log('📝 No migration files found, skipping migrations');
        return;
      }

      for (const file of migrationFiles) {
        if (!executedMigrations.includes(file)) {
          console.log(`🔄 Running migration: ${file}`);
          
          const migrationSQL = fs.readFileSync(
            path.join(this.migrationsPath, file), 
            'utf8'
          );
          
          try {
            await pool.query('BEGIN');
            await pool.query(migrationSQL);
            await pool.query(
              'INSERT INTO migrations (filename) VALUES ($1)', 
              [file]
            );
            await pool.query('COMMIT');
            
            console.log(`✅ Migration ${file} completed successfully`);
          } catch (error) {
            await pool.query('ROLLBACK');
            console.error(`❌ Migration ${file} failed:`, error);
            throw error;
          }
        } else {
          console.log(`⏭️  Migration ${file} already executed`);
        }
      }
      
      console.log('🎉 All migrations completed successfully');
    } catch (error) {
      console.error('❌ Migration error:', error);
      throw error;
    }
  }
}

export default new MigrationManager();
