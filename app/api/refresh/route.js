import { ingestAll } from '../../../lib/ingest.js';

function isAuthorized(request) {
  const auth = request.headers.get('authorization') || '';
  const token = process.env.REFRESH_TOKEN || '';
  if (!token) return true;
  return auth === `Bearer ${token}`;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const digest = await ingestAll();
    return Response.json({ ok: true, digest });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const digest = await ingestAll();
    return Response.json({ ok: true, digest });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
