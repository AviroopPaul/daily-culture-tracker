import { getSettings, saveSettings } from '../../../lib/settings.js';

export async function GET() {
  const settings = getSettings();
  return Response.json({ settings });
}

export async function POST(request) {
  const body = await request.json();
  const settings = saveSettings({
    primaryTopics: Array.isArray(body.primaryTopics) ? body.primaryTopics : [],
    secondaryTopics: Array.isArray(body.secondaryTopics) ? body.secondaryTopics : [],
    blocklist: Array.isArray(body.blocklist) ? body.blocklist : [],
    timezone: body.timezone || undefined,
    refreshHour: Number.isFinite(body.refreshHour) ? body.refreshHour : undefined
  });
  return Response.json({ ok: true, settings });
}
