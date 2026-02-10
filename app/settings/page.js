'use client';

import Link from 'next/link';
import { FiChevronLeft, FiSave } from 'react-icons/fi';
import { useEffect, useState } from 'react';

function toList(value) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

export default function SettingsPage() {
  const [primaryTopics, setPrimaryTopics] = useState('');
  const [secondaryTopics, setSecondaryTopics] = useState('');
  const [blocklist, setBlocklist] = useState('');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [refreshHour, setRefreshHour] = useState(8);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/settings');
      const data = await res.json();
      const settings = data.settings || {};
      setPrimaryTopics((settings.primaryTopics || []).join(', '));
      setSecondaryTopics((settings.secondaryTopics || []).join(', '));
      setBlocklist((settings.blocklist || []).join(', '));
      setTimezone(settings.timezone || 'America/Los_Angeles');
      setRefreshHour(settings.refreshHour ?? 8);
    }
    load();
  }, []);

  async function handleSave(event) {
    event.preventDefault();
    setStatus('saving');
    const payload = {
      primaryTopics: toList(primaryTopics),
      secondaryTopics: toList(secondaryTopics),
      blocklist: toList(blocklist),
      timezone,
      refreshHour: Number(refreshHour)
    };

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setStatus(res.ok ? 'saved' : 'error');
    setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand">Settings</div>
          <div className="brand-sub">Tune what the tracker prioritizes.</div>
        </div>
        <nav className="nav">
          <Link href="/" className="nav-link"><FiChevronLeft /> Dashboard</Link>
        </nav>
      </header>

      <form className="card settings-card" onSubmit={handleSave}>
        <div className="field">
          <label className="item-meta">Primary topics</label>
          <input
            className="settings-input"
            value={primaryTopics}
            onChange={event => setPrimaryTopics(event.target.value)}
            placeholder="H-1B, O-1, ICE, USCIS"
          />
          <p className="hint">These strongly influence ranking and the Visa section.</p>
        </div>

        <div className="field">
          <label className="item-meta">Secondary topics</label>
          <input
            className="settings-input"
            value={secondaryTopics}
            onChange={event => setSecondaryTopics(event.target.value)}
            placeholder="markets, policy, super bowl"
          />
        </div>

        <div className="field">
          <label className="item-meta">Blocklist terms</label>
          <input
            className="settings-input"
            value={blocklist}
            onChange={event => setBlocklist(event.target.value)}
            placeholder="celebrity gossip, spoilers"
          />
        </div>

        <div className="field">
          <label className="item-meta">Timezone</label>
          <input
            className="settings-input"
            value={timezone}
            onChange={event => setTimezone(event.target.value)}
            placeholder="America/Los_Angeles"
          />
        </div>

        <div className="field">
          <label className="item-meta">Daily refresh hour (0-23)</label>
          <input
            className="settings-input"
            type="number"
            min={0}
            max={23}
            value={refreshHour}
            onChange={event => setRefreshHour(event.target.value)}
          />
        </div>

        <div className="settings-actions">
          <button className="primary-button" type="submit">
            <FiSave />
            {status === 'saving' ? 'Saving...' : 'Save settings'}
          </button>
          {status === 'saved' && <span className="item-meta">Saved.</span>}
          {status === 'error' && <span className="item-meta">Save failed.</span>}
        </div>
      </form>
    </main>
  );
}
