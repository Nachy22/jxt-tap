const pool = require('../db');

const processTransaction = async (req, res) => {
  const { cardUid, driverId } = req.body;

  if (!cardUid || !driverId) {
    return res.status(400).json({ error: 'cardUid and driverId are required' });
  }

  const client = await pool.connect();

  try {
    // 1. Get the driver's currently active leg (which stops they're serving right now)
    const driverResult = await client.query(
      `SELECT current_route_id, current_from_stop_id, current_to_stop_id
       FROM drivers WHERE id = $1`,
      [driverId],
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const { current_route_id, current_from_stop_id, current_to_stop_id } =
      driverResult.rows[0];

    if (!current_route_id || !current_from_stop_id || !current_to_stop_id) {
      return res.status(400).json({
        error: 'Driver has not set their current route stage yet',
      });
    }

    // 2. Look up the fare for this exact leg, plus readable stop names
    const tariffResult = await client.query(
      `SELECT t.fare, f.name AS from_stop_name, s.name AS to_stop_name
       FROM tariffs t
       JOIN stops f ON f.id = t.from_stop_id
       JOIN stops s ON s.id = t.to_stop_id
       WHERE t.route_id = $1 AND t.from_stop_id = $2 AND t.to_stop_id = $3
       AND (t.effective_to IS NULL)
       LIMIT 1`,
      [current_route_id, current_from_stop_id, current_to_stop_id],
    );

    if (tariffResult.rows.length === 0) {
      return res.status(404).json({ error: 'No fare set for this route stage' });
    }

    const { fare, from_stop_name, to_stop_name } = tariffResult.rows[0];
    const routeStage = `${from_stop_name} → ${to_stop_name}`;

    // 3. Look up the card and its linked account balance
    const cardResult = await client.query(
      `SELECT c.id AS card_id, a.id AS account_id, a.balance
       FROM cards c
       JOIN accounts a ON a.id = c.account_id
       WHERE c.uid = $1 AND c.status = 'active'`,
      [cardUid],
    );

    if (cardResult.rows.length === 0) {
      return res.status(404).json({ error: 'Card not found or inactive' });
    }

    const { card_id, account_id, balance } = cardResult.rows[0];
    const currentBalance = parseFloat(balance);
    const fareAmount = parseFloat(fare);

    // 4. Check balance and process accordingly
    if (currentBalance < fareAmount) {
      // Insufficient balance — record the failed attempt, don't touch balance
      await client.query(
        `INSERT INTO transactions
         (card_id, driver_id, from_stop_id, to_stop_id, fare_amount, status)
         VALUES ($1, $2, $3, $4, $5, 'failed_insufficient_balance')`,
        [card_id, driverId, current_from_stop_id, current_to_stop_id, fareAmount],
      );

      return res.status(200).json({
        success: false,
        reason: 'insufficient_balance',
        cardBalance: currentBalance.toFixed(2),
        fare: fareAmount.toFixed(2),
        cardUid,
        routeStage,
      });
    }

    // Sufficient balance — deduct and record success
    await client.query('BEGIN');

    const newBalance = currentBalance - fareAmount;

    await client.query(`UPDATE accounts SET balance = $1 WHERE id = $2`, [
      newBalance,
      account_id,
    ]);

    await client.query(
      `INSERT INTO transactions
       (card_id, driver_id, from_stop_id, to_stop_id, fare_amount, status)
       VALUES ($1, $2, $3, $4, $5, 'success')`,
      [card_id, driverId, current_from_stop_id, current_to_stop_id, fareAmount],
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      fare: fareAmount.toFixed(2),
      cardUid,
      routeStage,
      remainingBalance: newBalance.toFixed(2),
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Transaction processing failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = { processTransaction };