const pool = require('./index');

async function setBalance() {
  const newBalance = process.argv[2] || 2.0; // pass amount as argument, defaults to 2.00

  try {
    await pool.query(
      `UPDATE accounts SET balance = $1 WHERE id = (
        SELECT account_id FROM cards WHERE uid = '967AFCBE'
      )`,
      [newBalance],
    );
    console.log(`Balance set to ETB ${newBalance}`);
  } catch (err) {
    console.error('Failed to update balance:', err);
  } finally {
    await pool.end();
  }
}

setBalance();