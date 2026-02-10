export async function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 12000);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'DailyCultureTracker/1.0',
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`Fetch failed ${res.status}`);
    }
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

export function toISO(date) {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}
