// setupDatabase.js
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    host:     process.env.PGHOST,
    port:     process.env.PGPORT,
    database: process.env.PGDATABASE,
    user:     process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });

  try {
    console.log('🔄 Applying migrations…');

    const migrationsDir = path.join(__dirname, 'db', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`▶ Running ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
    }

    console.log('✅ Migrations complete!');

    // Optionally verify:
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM products');
    console.log(`📦 Products table has ${rows[0].count} rows.`);

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
