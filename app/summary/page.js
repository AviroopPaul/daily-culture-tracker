import Link from 'next/link';
import { FiSettings } from 'react-icons/fi';
import { getLatestDigest } from '../../lib/ingest.js';
import RefreshButton from '../components/RefreshButton.js';

export default function SummaryPage() {
  const digest = getLatestDigest();

  return (
    <main>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand">Daily Summary</div>
          <div className="brand-sub">Snapshot of today’s most important stories.</div>
        </div>
        <nav className="nav">
          <Link href="/">Dashboard</Link>
        </nav>
        <div className="actions">
          <RefreshButton />
          <Link className="icon-button" href="/settings" aria-label="Settings">
            <FiSettings />
          </Link>
        </div>
      </header>

      {!digest && <div className="item-meta">No digest generated yet.</div>}

      {digest && (
        <>
          <div className="status-bar">
            <div className="badge">{digest.date}</div>
            <div className="status-note">Generated at {new Date(digest.generated_at).toLocaleString()}</div>
          </div>

          <div className="section-title">Top Headlines</div>
          <div className="grid two">
            {(digest.top_items || []).map(item => (
              <div key={item.url || item.title} className="card">
                <div className="item-title">
                  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                </div>
                <div className="item-meta">{item.source}</div>
              </div>
            ))}
          </div>

          <div className="section-title">Notes</div>
          <div className="summary">
            {digest.notes?.length ? digest.notes.join(' ') : 'No special notes today.'}
          </div>
        </>
      )}
    </main>
  );
}
