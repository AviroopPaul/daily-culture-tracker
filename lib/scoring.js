import { CONFIG } from './config.js';
import { getRuntimePreferences } from './runtime-config.js';

export function scoreItem(item) {
  const title = `${item.title} ${item.summary || ''}`.toLowerCase();
  let score = 0;
  const prefs = getRuntimePreferences();

  for (const term of prefs.primaryTopics) {
    if (term && title.includes(term.toLowerCase())) score += CONFIG.score.keywordBoost;
  }

  for (const term of prefs.secondaryTopics) {
    if (term && title.includes(term.toLowerCase())) score += CONFIG.score.secondaryBoost;
  }

  for (const term of prefs.blocklist) {
    if (term && title.includes(term.toLowerCase())) score -= 5;
  }

  const publishedAt = item.published_at ? new Date(item.published_at) : null;
  if (publishedAt && !Number.isNaN(publishedAt.getTime())) {
    const hoursOld = (Date.now() - publishedAt.getTime()) / 36e5;
    if (hoursOld <= CONFIG.score.recencyBoostHours) {
      score += Math.max(0, CONFIG.score.recencyBoostHours - hoursOld) * 0.15;
    }
  }

  return Math.round(score * 10) / 10;
}

export function classifyCategory(item) {
  const text = `${item.title} ${item.summary || ''}`.toLowerCase();

  const visaTerms = ['h-1b', 'o-1', 'uscis', 'ice', 'cbp', 'dhs', 'visa', 'immigration', 'green card'];
  if (visaTerms.some(term => text.includes(term))) return 'visa';

  const financeTerms = ['market', 'stocks', 'fed', 'nasdaq', 'dow', 's&p', 'earnings', 'inflation', 'bond', 'bitcoin', 'crypto'];
  if (financeTerms.some(term => text.includes(term))) return 'finance';

  const cultureTerms = ['concert', 'tour', 'album', 'film', 'movie', 'super bowl', 'oscars', 'grammys', 'festival', 'tv show', 'meme', 'celebrity'];
  if (cultureTerms.some(term => text.includes(term))) return 'culture';

  return 'world';
}
