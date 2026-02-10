'use client';

import Link from 'next/link';
import { FiSettings } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import RefreshButton from './components/RefreshButton.js';

const TABS = [
  { id: 'headlines', label: 'Top Headlines' },
  { id: 'finance', label: 'Finance' },
  { id: 'visa', label: 'Visas' },
  { id: 'culture', label: 'Pop Culture' },
  { id: 'trends', label: 'Trends & Memes' }
];

function Item({ item }) {
  return (
    <div className="item">
      <div className="item-title">
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
      </div>
      <div className="item-meta">
        <span>{item.source || 'Source'}</span>
        {item.published_at && <span>{new Date(item.published_at).toLocaleString()}</span>}
      </div>
    </div>
  );
}

export default function Home() {
  const [digest, setDigest] = useState(null);
  const [activeTab, setActiveTab] = useState('headlines');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/digest/latest');
      const data = await res.json();
      setDigest(data.digest || null);
    }
    load();
  }, []);

  function itemsForTab(tab) {
    if (!digest) return [];
    switch (tab) {
      case 'finance':
        return digest.finance_items || [];
      case 'visa':
        return digest.visa_items || [];
      case 'culture':
        return digest.culture_items || [];
      case 'trends':
        return digest.meme_items || [];
      default:
        return digest.top_items || [];
    }
  }

  const items = itemsForTab(activeTab);

  return (
    <main>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand">Daily Culture Tracker</div>
          <div className="brand-sub">World, markets, visas, and culture — curated daily.</div>
        </div>
        <nav className="nav">
          <Link href="/summary">Summary</Link>
        </nav>
        <div className="actions">
          <RefreshButton />
          <Link className="icon-button" href="/settings" aria-label="Settings">
            <FiSettings />
          </Link>
        </div>
      </header>

      <div className="status-bar">
        <div className="badge">
          {digest ? `Last refresh: ${new Date(digest.generated_at).toLocaleString()}` : 'No digest yet'}
        </div>
        <div className="status-note">Update topics and schedule in Settings.</div>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {items.length === 0 && <div className="item-meta">No updates yet.</div>}
        {items.map(item => (
          <Item key={item.url || item.title} item={item} />
        ))}
      </div>

      <div className="summary">
        <strong>Daily Summary</strong>
        <div className="item-meta">
          {digest?.notes?.length ? digest.notes.join(' ') : 'Coverage looks healthy today.'}
        </div>
        <div className="item-meta">
          Full recap: <Link href="/summary">Summary page</Link>
        </div>
      </div>

      <div className="footer">
        Sources: GNews, GDELT, Alpha Vantage, Google Trends (RSS). Configure API keys in environment variables.
      </div>
    </main>
  );
}
