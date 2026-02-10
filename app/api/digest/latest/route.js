import { getLatestDigest, buildDigest } from '../../../../lib/ingest.js';

export async function GET() {
  let digest = getLatestDigest();
  if (!digest) {
    digest = buildDigest();
  }
  return Response.json({ digest });
}
