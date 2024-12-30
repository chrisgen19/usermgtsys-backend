// src/scripts/seedUsers.js
require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const dummyUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123'
  },
  {
    username: 'bob_wilson',
    email: 'bob@example.com',
    password: 'password123'
  },
  {
    username: 'alice_johnson',
    email: 'alice@example.com',
    password: 'password123'
  },
  {
    username: 'charlie_brown',
    email: 'charlie@example.com',
    password: 'password123'
  }
];

async function seedUsers() {
  try {
    // First, clear existing users (optional - remove if you want to keep existing users)
    console.log('Clearing existing users...');
    await pool.query('DELETE FROM users');
    
    console.log('Starting to seed users...');
    
    // Hash all passwords
    const usersWithHashedPasswords = await Promise.all(
      dummyUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Insert users
    for (const user of usersWithHashedPasswords) {
      console.log(`Attempting to create user: ${user.username}`);
      
      const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email
      `;
      
      const result = await pool.query(query, [user.username, user.email, user.password]);
      console.log(`Successfully created user: ${result.rows[0].username} with ID: ${result.rows[0].id}`);
    }

    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`Total users in database: ${countResult.rows[0].count}`);

    console.log('Seeding completed successfully');
    await pool.end(); // Close the database connection
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    await pool.end(); // Close the database connection
    process.exit(1);
  }
}

// Run the seeder
seedUsers();