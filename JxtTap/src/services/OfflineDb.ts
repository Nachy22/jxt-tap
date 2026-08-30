import { open } from '@op-engineering/op-sqlite';

const db = open({ name: 'jxttap-offline.db' });

// Create the offline queue table if it doesn't exist yet
db.execute(`
  CREATE TABLE IF NOT EXISTS pending_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_uid TEXT NOT NULL,
    driver_id INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export type PendingTransaction = {
  id: number;
  card_uid: string;
  driver_id: number;
  created_at: string;
};

// Adds a tap to the offline queue
export const queueTransaction = async (cardUid: string, driverId: number) => {
  await db.execute(
    `INSERT INTO pending_transactions (card_uid, driver_id, created_at) VALUES (?, ?, ?)`,
    [cardUid, driverId, new Date().toISOString()],
  );
};

// Gets all queued transactions waiting to sync
export const getQueuedTransactions = async () => {
  const result = await db.execute(
    `SELECT * FROM pending_transactions ORDER BY id ASC`,
  );
  return (result.rows ?? []) as unknown as PendingTransaction[];
};

// Removes a transaction from the queue once it's been synced successfully
export const removeQueuedTransaction = async (id: number) => {
  await db.execute(`DELETE FROM pending_transactions WHERE id = ?`, [id]);
};

// Gets how many transactions are currently waiting to sync
export const getQueuedCount = async () => {
  const result = await db.execute(
    `SELECT COUNT(*) as count FROM pending_transactions`,
  );
  const rows = (result.rows ?? []) as unknown as { count: number }[];
  return rows[0]?.count ?? 0;
};

export default db;