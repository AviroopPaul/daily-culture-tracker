import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'db.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    const seed = { items: [], digests: [], settings: null };
    fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2));
  }
}

export function loadDb() {
  ensureStore();
  const raw = fs.readFileSync(dbPath, 'utf8');
  const parsed = JSON.parse(raw || '{}');
  return {
    items: Array.isArray(parsed.items) ? parsed.items : [],
    digests: Array.isArray(parsed.digests) ? parsed.digests : [],
    settings: parsed.settings || null
  };
}

export function saveDb(db) {
  ensureStore();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function upsertItems(db, items) {
  const byUrl = new Map(db.items.map(item => [item.url, item]));
  for (const item of items) {
    const existing = byUrl.get(item.url);
    if (existing) {
      byUrl.set(item.url, { ...existing, ...item });
    } else {
      byUrl.set(item.url, { ...item, created_at: new Date().toISOString() });
    }
  }
  db.items = Array.from(byUrl.values());
}

export function upsertDigest(db, digest) {
  const byDate = new Map(db.digests.map(item => [item.date, item]));
  byDate.set(digest.date, digest);
  db.digests = Array.from(byDate.values());
}

export function latestDigest(db) {
  if (!db.digests.length) return null;
  return db.digests.sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at))[0];
}

export function listItems(db, { category, limit = 20 }) {
  const filtered = category ? db.items.filter(item => item.category === category) : db.items;
  return filtered
    .sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))
    .slice(0, limit);
}
