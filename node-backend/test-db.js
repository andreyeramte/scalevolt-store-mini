// test-db.js
import pg from 'pg';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';

// Set up dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize dotenv
dotenv.config();

const { Pool } = pg;

// Create a new pool with explicit connection information
const pool = new Pool({
  host: 'localhost',
  port: 5433,  // Make sure this matches your PostgreSQL port
  user: 'postgres',
  password: 'new_password', // Replace with your actual password
  database: 'scalevolt_store'
});

async function testConnection() {
  try {
    // Test basic connection
    console.log('Attempting to connect to PostgreSQL...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    
    // Test creating a table
    console.log('Creating test table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Test table created successfully');
    
    // Insert a record
    console.log('Inserting test record...');
    await pool.query(`
      INSERT INTO test_connection (name) VALUES ($1)
    `, ['test connection']);
    console.log('Test record inserted successfully');
    
    // Query the record
    console.log('Querying test records...');
    const records = await pool.query('SELECT * FROM test_connection');
    console.log('Test records:', records.rows);
    
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Error details:', error.stack);
  } finally {
    // Close the pool
    await pool.end();
    console.log('Database connection pool closed');
  }
}

// Run the test
testConnection();