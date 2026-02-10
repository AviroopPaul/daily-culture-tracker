import { safeFetch } from '../fetcher.js';

function extractTag(block, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = block.match(regex);
  return match ? match[1].trim() : '';
}

export async function fetchTrends() {
  const url = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US';
  const res = await safeFetch(url, { headers: { 'Accept': 'application/rss+xml' } });
  const xml = await res.text();

  const items = [];
  const itemBlocks = xml.split('<item>').slice(1);
  for (const block of itemBlocks) {
    const itemXml = block.split('</item>')[0];
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    if (!title) continue;
    items.push({
      title: title.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1'),
      url: link.replace(/<!\[CDATA\[(.*?)\]\]>/, '$1'),
      summary: 'Google Trends daily trend',
      published_at: pubDate ? new Date(pubDate).toISOString() : null,
      source: 'Google Trends'
    });
  }

  return items;
}
