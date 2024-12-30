const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    
    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateById(id, userData) {
    const { username, email } = userData;
    const query = `
      UPDATE users
      SET 
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, username, email, updated_at
    `;
    
    const values = [username, email, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteById(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async create(userData) {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    
    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
  
}

module.exports = User;