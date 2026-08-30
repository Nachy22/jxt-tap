import { processTransaction } from './ApiService';
import {
  getQueuedTransactions,
  removeQueuedTransaction,
} from './OfflineDb';

// Attempts to sync every queued offline transaction to the backend.
// Successful ones are removed from the queue; failed ones stay queued for next time.
export const syncQueuedTransactions = async (): Promise<{
  synced: number;
  remaining: number;
}> => {
  const queued = await getQueuedTransactions();

  if (queued.length === 0) {
    return { synced: 0, remaining: 0 };
  }

  let synced = 0;

  for (const tx of queued) {
    const result = await processTransaction(tx.card_uid, tx.driver_id);

    if (result) {
      // Successfully processed (whether the fare succeeded or failed due to
      // balance) — either way, the server now has a record, so remove it
      // from the local queue.
      await removeQueuedTransaction(tx.id);
      synced++;
    }
    // If result is null, we're still offline — leave it queued and stop
    // trying the rest for now.
    else {
      break;
    }
  }

  const remaining = queued.length - synced;
  return { synced, remaining };
};