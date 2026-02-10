'use client';

import { useState } from 'react';
import { FiRefreshCcw } from 'react-icons/fi';

export default function RefreshButton() {
  const [status, setStatus] = useState('idle');

  async function handleRefresh() {
    setStatus('loading');
    try {
      const res = await fetch('/api/refresh', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Refresh failed');
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <button className={`icon-button ${status}`} onClick={handleRefresh} type="button" aria-label="Refresh news">
      <FiRefreshCcw />
    </button>
  );
}
