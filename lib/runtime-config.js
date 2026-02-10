import { getSettings } from './settings.js';

export function getRuntimePreferences() {
  const settings = getSettings();
  return {
    primaryTopics: settings.primaryTopics || [],
    secondaryTopics: settings.secondaryTopics || [],
    blocklist: settings.blocklist || []
  };
}
