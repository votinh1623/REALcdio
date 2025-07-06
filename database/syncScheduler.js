// database/syncScheduler.js
// import { syncCollections } from '../sync_databases.js'; // npm run dev
import { syncCollections } from './sync_databases.js';

const SYNC_INTERVAL_MS = 100 * 60 * 1000; // 10 minutes

// Function to schedule automatic syncing
function startAutoSync() {
  console.log(`[${new Date().toISOString()}] Auto-sync scheduler started`);
  //syncCollections(); // run once immediately

  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Running scheduled sync...`);
   // syncCollections();
  }, SYNC_INTERVAL_MS);
}

if (process.argv[1].endsWith('syncScheduler.js')) {
  console.log(`[${new Date().toISOString()}] Running manual sync...`);
  syncCollections();
} else {
  // If imported into server.js, run auto sync
  startAutoSync();
}
