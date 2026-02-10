import { CONFIG } from '../config.js';
import { safeFetch, toISO } from '../fetcher.js';

export async function fetchGNews() {
  if (!CONFIG.gnewsApiKey) return [];

  const endpoints = [
    `https://gnews.io/api/v4/top-headlines?lang=en&max=20&token=${CONFIG.gnewsApiKey}`,
    `https://gnews.io/api/v4/top-headlines?lang=en&topic=world&max=20&token=${CONFIG.gnewsApiKey}`,
    `https://gnews.io/api/v4/top-headlines?lang=en&topic=business&max=20&token=${CONFIG.gnewsApiKey}`,
    `https://gnews.io/api/v4/top-headlines?lang=en&topic=entertainment&max=20&token=${CONFIG.gnewsApiKey}`
  ];

  const results = [];
  for (const url of endpoints) {
    const res = await safeFetch(url);
    const data = await res.json();
    for (const article of data.articles || []) {
      results.push({
        title: article.title,
        url: article.url,
        summary: article.description || article.content || '',
        published_at: toISO(article.publishedAt),
        source: article.source?.name || 'GNews',
        image: article.image || ''
      });
    }
  }

  return results;
}
