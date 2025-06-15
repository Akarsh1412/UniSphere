import pool from '../config/database.js';

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }
  
  async findById(id) {
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }
  
  async findAll(conditions = {}, limit = null, offset = null) {
    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }
    
    if (offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(offset);
    }
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }
  
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    
    const query = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
  
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [id, ...values]);
    return result.rows[0];
  }
  
  async delete(id) {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
  
  async count(conditions = {}) {
    let query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    const result = await this.pool.query(query, params);
    return parseInt(result.rows[0].count);
  }
}

// Initialize models
const User = new BaseModel('users');
const Club = new BaseModel('clubs');
const Event = new BaseModel('events');
const Post = new BaseModel('posts');
const Comment = new BaseModel('comments');
const Like = new BaseModel('likes');
const ClubMembership = new BaseModel('club_memberships');
const EventRegistration = new BaseModel('event_registrations');

export {
  BaseModel,
  User,
  Club,
  Event,
  Post,
  Comment,
  Like,
  ClubMembership,
  EventRegistration,
  pool
};
