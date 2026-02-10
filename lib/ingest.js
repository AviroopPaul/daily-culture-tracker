import { loadDb, saveDb, upsertItems, upsertDigest, latestDigest, listItems as listItemsFromDb } from './db.js';
import { fetchGNews } from './sources/gnews.js';
import { fetchGDELT } from './sources/gdelt.js';
import { fetchAlphaVantage } from './sources/alphavantage.js';
import { fetchTrends } from './sources/trends.js';
import { classifyCategory, scoreItem } from './scoring.js';

function dedupe(items) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = item.url || item.title;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

export async function ingestAll() {
  const sources = await Promise.allSettled([
    fetchGNews(),
    fetchGDELT(),
    fetchAlphaVantage(),
    fetchTrends()
  ]);

  const items = sources.flatMap(result => (result.status === 'fulfilled' ? result.value : []));
  const unique = dedupe(items);
  const db = loadDb();
  const toInsert = unique.map(item => {
    const category = classifyCategory(item);
    const scored = scoreItem({ ...item, category });
    return {
      ...item,
      category,
      region: 'global',
      score: scored,
      tags: ''
    };
  });

  upsertItems(db, toInsert);
  saveDb(db);

  return buildDigest();
}

export function buildDigest() {
  const db = loadDb();
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);

  const byScore = [...db.items].sort((a, b) => (b.score || 0) - (a.score || 0) || new Date(b.published_at || 0) - new Date(a.published_at || 0)).slice(0, 10);
  const finance = db.items.filter(item => item.category === 'finance').sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 6);
  const visa = db.items.filter(item => item.category === 'visa').sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 6);
  const culture = db.items.filter(item => item.category === 'culture').sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 6);
  const memes = db.items.filter(item => item.source === 'Google Trends').sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0)).slice(0, 6);

  const notes = [];
  if (visa.length === 0) notes.push('No major visa/immigration updates today.');
  if (memes.length === 0) notes.push('Trends feed unavailable; showing entertainment headlines only.');

  const digest = {
    date: dateKey,
    generated_at: now.toISOString(),
    top_items: byScore,
    finance_items: finance,
    visa_items: visa,
    culture_items: culture,
    meme_items: memes,
    notes
  };

  upsertDigest(db, digest);
  saveDb(db);

  return digest;
}

export function getLatestDigest() {
  const db = loadDb();
  return latestDigest(db);
}

export function listItems({ category, limit = 20 }) {
  const db = loadDb();
  return listItemsFromDb(db, { category, limit });
}
