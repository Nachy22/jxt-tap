const pool = require('../db');

// GET /routes/:id/legs — all fare-priced stop-to-stop segments for a route
const getRouteLegs = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT
         t.from_stop_id,
         t.to_stop_id,
         f.name AS from_stop_name,
         s.name AS to_stop_name,
         t.fare
       FROM tariffs t
       JOIN stops f ON f.id = t.from_stop_id
       JOIN stops s ON s.id = t.to_stop_id
       WHERE t.route_id = $1 AND t.effective_to IS NULL
       ORDER BY f.sequence_order`,
      [id],
    );

    const legs = result.rows.map(row => ({
      fromStopId: row.from_stop_id,
      toStopId: row.to_stop_id,
      label: `${row.from_stop_name} → ${row.to_stop_name}`,
      fare: parseFloat(row.fare).toFixed(2),
    }));

    res.json(legs);
  } catch (err) {
    console.error('Failed to get route legs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getRouteLegs };