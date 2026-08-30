const pool = require('../db');

// GET /driver/:id/summary — today's total collected and trip count
const getDriverSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         COALESCE(SUM(fare_amount), 0) AS total,
         COUNT(*) AS trips
       FROM transactions
       WHERE driver_id = $1
         AND status = 'success'
         AND created_at::date = CURRENT_DATE`,
      [id],
    );

    const { total, trips } = result.rows[0];

    res.json({
      total: parseFloat(total).toFixed(2),
      trips: parseInt(trips, 10),
    });
  } catch (err) {
    console.error('Failed to get driver summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /driver/:id/transactions — today's list of successful fares, most recent first
const getDriverTransactions = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         t.id,
         t.fare_amount,
         t.created_at,
         c.uid AS card_uid,
         f.name AS from_stop_name,
         s.name AS to_stop_name
       FROM transactions t
       JOIN cards c ON c.id = t.card_id
       JOIN stops f ON f.id = t.from_stop_id
       JOIN stops s ON s.id = t.to_stop_id
       WHERE t.driver_id = $1
         AND t.status = 'success'
         AND t.created_at::date = CURRENT_DATE
       ORDER BY t.created_at DESC`,
      [id],
    );

    const transactions = result.rows.map(row => ({
      id: row.card_uid.slice(-4),
      time: new Date(row.created_at).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      route: `${row.from_stop_name} → ${row.to_stop_name}`,
      fare: parseFloat(row.fare_amount),
    }));

    res.json(transactions);
  } catch (err) {
    console.error('Failed to get driver transactions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /driver/:id — basic driver info including current leg
const getDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         d.id, d.name,
         d.current_route_id,
         d.current_from_stop_id,
         d.current_to_stop_id,
         f.name AS from_stop_name,
         s.name AS to_stop_name,
         r.name AS route_name
       FROM drivers d
       LEFT JOIN stops f ON f.id = d.current_from_stop_id
       LEFT JOIN stops s ON s.id = d.current_to_stop_id
       LEFT JOIN routes r ON r.id = d.current_route_id
       WHERE d.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const row = result.rows[0];

    res.json({
      id: row.id,
      name: row.name,
      routeId: row.current_route_id,
      routeName: row.route_name,
      currentLeg: row.from_stop_name
        ? `${row.from_stop_name} → ${row.to_stop_name}`
        : null,
      fromStopId: row.current_from_stop_id,
      toStopId: row.current_to_stop_id,
    });
  } catch (err) {
    console.error('Failed to get driver:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /driver/:id/current-leg — update which stop-to-stop segment the driver is serving
const updateCurrentLeg = async (req, res) => {
  const { id } = req.params;
  const { fromStopId, toStopId } = req.body;

  if (!fromStopId || !toStopId) {
    return res
      .status(400)
      .json({ error: 'fromStopId and toStopId are required' });
  }

  try {
    await pool.query(
      `UPDATE drivers
       SET current_from_stop_id = $1, current_to_stop_id = $2
       WHERE id = $3`,
      [fromStopId, toStopId, id],
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update current leg:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDriverSummary,
  getDriverTransactions,
  getDriver,
  updateCurrentLeg,
};