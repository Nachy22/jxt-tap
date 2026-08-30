const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function runMigration() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'migrations.sql'),
      'utf8',
    );

    console.log('Running migrations...');
    await pool.query(sql);
    console.log('All tables created successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

runMigration();