import { listItems } from '../../../lib/ingest.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = Number(searchParams.get('limit') || 20);
  const items = listItems({ category, limit });
  return Response.json({ items });
}
