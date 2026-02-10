import { ingestAll } from '../lib/ingest.js';

(async () => {
  try {
    const digest = await ingestAll();
    console.log('Digest generated', digest.date, digest.generated_at);
  } catch (error) {
    console.error('Refresh failed', error);
    process.exitCode = 1;
  }
})();
