const pool = require('./index');

async function seed() {
  try {
    console.log('Seeding sample data...');

    // 1. Create a route
    const routeResult = await pool.query(
      `INSERT INTO routes (name, description) VALUES ($1, $2) RETURNING id`,
      ['Route 23', 'Town – Addis Ababa'],
    );
    const routeId = routeResult.rows[0].id;

    // 2. Create stops along that route, in order
    const stopNames = ['Town', 'Megenagna', 'CMC'];
    const stopIds = [];

    for (let i = 0; i < stopNames.length; i++) {
      const stopResult = await pool.query(
        `INSERT INTO stops (route_id, name, sequence_order) VALUES ($1, $2, $3) RETURNING id`,
        [routeId, stopNames[i], i + 1],
      );
      stopIds.push(stopResult.rows[0].id);
    }
    const [townId, megenagnaId, cmcId] = stopIds;

    // 3. Create tariffs (fares) between stop pairs
    const tariffs = [
      { from: townId, to: megenagnaId, fare: 8.0 },
      { from: megenagnaId, to: cmcId, fare: 10.0 },
      { from: townId, to: cmcId, fare: 15.0 },
    ];

    for (const t of tariffs) {
      await pool.query(
        `INSERT INTO tariffs (route_id, from_stop_id, to_stop_id, fare) VALUES ($1, $2, $3, $4)`,
        [routeId, t.from, t.to, t.fare],
      );
    }

    // 4. Create a test owner
    const ownerResult = await pool.query(
      `INSERT INTO owners (name, phone_number, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      ['Test Owner', '0900000000', 'placeholder_hash'],
    );
    const ownerId = ownerResult.rows[0].id;

    // 5. Create a test driver, with their current leg set to Town -> Megenagna
    const driverResult = await pool.query(
      `INSERT INTO drivers (name, phone_number, password_hash, current_route_id, current_from_stop_id, current_to_stop_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      ['Tadesse Girma', '0911111111', 'placeholder_hash', routeId, townId, megenagnaId],
    );
    const driverId = driverResult.rows[0].id;

    // 6. Create a test vehicle linking the owner, driver, and route
    await pool.query(
      `INSERT INTO vehicles (owner_id, driver_id, route_id, plate_number) VALUES ($1, $2, $3, $4)`,
      [ownerId, driverId, routeId, 'AA-1234'],
    );

    // 7. Create a test commuter account and card (using the real UID we scanned earlier)
    const accountResult = await pool.query(
      `INSERT INTO accounts (phone_number, balance) VALUES ($1, $2) RETURNING id`,
      ['0922222222', 50.0],
    );
    const accountId = accountResult.rows[0].id;

    await pool.query(
      `INSERT INTO cards (uid, account_id, status) VALUES ($1, $2, $3)`,
      ['967AFCBE', accountId, 'active'],
    );

    console.log('Seed complete!');
    console.log('Route ID:', routeId);
    console.log('Stops:', { townId, megenagnaId, cmcId });
    console.log('Driver ID:', driverId);
    console.log('Test card UID: 967AFCBE, balance: 50.00');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
  }
}

seed();