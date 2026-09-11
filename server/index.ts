import { promises as fs } from 'node:fs';
import { createApp } from './app.ts';
import { PHOTOS_DIR } from './db.ts';

const PORT = Number(process.env.DASHBOARD_API_PORT ?? 4310);

async function main() {
  await fs.mkdir(PHOTOS_DIR, { recursive: true });

  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[dashboard-api] http://localhost:${PORT}`);
  });
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('[dashboard-api] échec du démarrage :', error);
  process.exit(1);
});
