export const CONFIG = {
  timezone: process.env.APP_TIMEZONE || 'America/Los_Angeles',
  refreshHour: Number(process.env.APP_REFRESH_HOUR || 8),
  gnewsApiKey: process.env.GNEWS_API_KEY || '',
  alphaVantageKey: process.env.ALPHA_VANTAGE_KEY || '',
  score: {
    keywordBoost: 5,
    secondaryBoost: 2,
    recencyBoostHours: 36
  },
  preferences: {
    primaryTopics: (process.env.PRIMARY_TOPICS || 'H-1B,O-1,ICE,USCIS,DHS,CBP,visa,immigration').split(',').map(s => s.trim()).filter(Boolean),
    secondaryTopics: (process.env.SECONDARY_TOPICS || 'election,policy,market,stocks,super bowl,concert,oscars,grammys').split(',').map(s => s.trim()).filter(Boolean),
    blocklist: (process.env.BLOCKLIST_TOPICS || '').split(',').map(s => s.trim()).filter(Boolean)
  }
};
