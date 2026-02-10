import { loadDb, saveDb } from './db.js';
import { CONFIG } from './config.js';

export function getSettings() {
  const db = loadDb();
  return db.settings || {
    primaryTopics: CONFIG.preferences.primaryTopics,
    secondaryTopics: CONFIG.preferences.secondaryTopics,
    blocklist: CONFIG.preferences.blocklist,
    timezone: CONFIG.timezone,
    refreshHour: CONFIG.refreshHour
  };
}

export function saveSettings(input) {
  const db = loadDb();
  db.settings = {
    primaryTopics: input.primaryTopics || CONFIG.preferences.primaryTopics,
    secondaryTopics: input.secondaryTopics || CONFIG.preferences.secondaryTopics,
    blocklist: input.blocklist || CONFIG.preferences.blocklist,
    timezone: input.timezone || CONFIG.timezone,
    refreshHour: Number.isFinite(input.refreshHour) ? input.refreshHour : CONFIG.refreshHour
  };
  saveDb(db);
  return db.settings;
}
