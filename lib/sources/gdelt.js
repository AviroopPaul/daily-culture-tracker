import { safeFetch, toISO } from '../fetcher.js';

export async function fetchGDELT() {
  const url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=language:english&mode=ArtList&maxrecords=40&format=json&sort=HybridRel';
  const res = await safeFetch(url);
  const data = await res.json();
  const articles = data.articles || [];

  return articles.map(article => ({
    title: article.title,
    url: article.url,
    summary: article.seendate ? `Seen: ${article.seendate}` : '',
    published_at: toISO(article.seendate),
    source: article.sourcecountry ? `GDELT:${article.sourcecountry}` : 'GDELT',
    image: article.image || article.socialimage || ''
  }));
}
