# Daily Culture Tracker

Single dashboard + daily summary for world news, finance headlines, visa/immigration watch, and pop‑culture trends.

## Setup

```bash
npm install
```

### Environment variables

```bash
GNEWS_API_KEY=...
ALPHA_VANTAGE_KEY=...
REFRESH_TOKEN=optional
APP_TIMEZONE=America/Los_Angeles
APP_REFRESH_HOUR=8
PRIMARY_TOPICS=H-1B,O-1,ICE,USCIS,DHS,CBP,visa,immigration
SECONDARY_TOPICS=election,policy,market,stocks,super bowl,concert,oscars,grammys
BLOCKLIST_TOPICS=
```

Environment variables are defaults. You can override topics from `/settings`.

### Run locally

```bash
npm run dev
```

### Manual refresh

```bash
npm run refresh
```

Or click the refresh icon in the dashboard header.

### API endpoints

- `GET /api/digest/latest`
- `GET /api/items?category=finance&limit=10`
- `POST /api/refresh` with `Authorization: Bearer <REFRESH_TOKEN>`
- `GET /api/refresh` (same auth rules as POST)
- `GET /api/settings`
- `POST /api/settings`

## Storage

Data is persisted to a JSON store at `data/db.json` (no native database dependency).

## Scheduling

Use a platform cron (Vercel Cron recommended) to hit `/api/refresh` daily at 8am local time.
