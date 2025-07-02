// sync_databases.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
import { isUsingBackup } from '../backend/lib/db.js';
const primaryUri = 'mongodb+srv://vnthienloi03:xsM5ydb5gP3Wu2RT@sontungmtp.vfjzp.mongodb.net/user_db?retryWrites=true&w=majority&appName=sontungmtp';
const backupUri = 'mongodb+srv://vnthienloi03:UTlMVRyqkI9VqlLf@backup.4mvudmi.mongodb.net/?retryWrites=true&w=majority&appName=backup';

export async function syncCollections() {
  const sourceUri = isUsingBackup ? backupUri : primaryUri;
  const targetUri = isUsingBackup ? primaryUri : backupUri;

  const sourceLabel = isUsingBackup ? 'BACKUP' : 'PRIMARY';
  const targetLabel = isUsingBackup ? 'PRIMARY (restoring)' : 'BACKUP';

  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    console.log(`🔄 Syncing from ${sourceLabel} to ${targetLabel}...`);

    // Try connecting to both
    await sourceClient.connect();
    await targetClient.connect();

    // Ping target (e.g. PRIMARY if using backup)
    const targetDb = targetClient.db();
    const pingResult = await targetDb.command({ ping: 1 }).catch(() => null);
    if (!pingResult) {
      console.warn(`⚠️ Target database (${targetLabel}) is unreachable. Skipping sync.`);
      return;
    }

    const sourceDb = sourceClient.db();

    const collections = await sourceDb.listCollections().toArray();

    for (const { name } of collections) {
      const sourceCol = sourceDb.collection(name);
      const targetCol = targetDb.collection(name);

      const docs = await sourceCol.find({}).toArray();
      await targetCol.deleteMany({});
      if (docs.length > 0) {
        await targetCol.insertMany(docs);
      }

      console.log(` Synced collection: ${name}`);
    }

    console.log(` Sync from ${sourceLabel} to ${targetLabel} completed successfully.`);
  } catch (err) {
    console.error(` Sync failed (${sourceLabel} → ${targetLabel}):`, err.message);
  } finally {
    await sourceClient.close().catch(() => {});
    await targetClient.close().catch(() => {});
  }
}
// 🧪 Run manually if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("[🧪] Running manual sync...");
    syncCollections();
}