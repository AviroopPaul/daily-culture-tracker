import { CONFIG } from '../config.js';
import { safeFetch, toISO } from '../fetcher.js';

export async function fetchAlphaVantage() {
  if (!CONFIG.alphaVantageKey) return [];
  const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${CONFIG.alphaVantageKey}&limit=30`;
  const res = await safeFetch(url);
  const data = await res.json();
  const feed = data.feed || [];

  return feed.map(item => ({
    title: item.title,
    url: item.url,
    summary: item.summary || '',
    published_at: toISO(item.time_published),
    source: item.source || 'Alpha Vantage',
    image: item.banner_image || ''
  }));
}
