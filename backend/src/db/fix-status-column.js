const pool = require('./index');

async function fixColumn() {
  try {
    await pool.query(
      `ALTER TABLE transactions ALTER COLUMN status TYPE VARCHAR(40)`,
    );
    console.log('Column widened successfully');
  } catch (err) {
    console.error('Failed to alter column:', err);
  } finally {
    await pool.end();
  }
}

fixColumn();