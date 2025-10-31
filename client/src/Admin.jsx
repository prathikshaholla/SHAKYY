import { useEffect, useState } from 'react';
import './App.css';

export default function Admin() {
  const [sosLogs, setSosLogs] = useState(null);
  const [shakeLogs, setShakeLogs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchLogs() {
    setLoading(true);
    setError(null);
    try {
      const [sRes, shRes] = await Promise.all([
        fetch('/api/sos'),
        fetch('/api/shake-intensity')
      ]);
      if (!sRes.ok || !shRes.ok) throw new Error('Failed to fetch logs');
      const [sosJson, shakeJson] = await Promise.all([sRes.json(), shRes.json()]);
      setSosLogs(sosJson);
      setShakeLogs(shakeJson);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="admin-card">
      <h3>Admin — Logs</h3>
      <div style={{ marginBottom: 8 }}>
        <button onClick={fetchLogs} className="btn-small">Refresh</button>
        <a href="/download-sos" style={{ marginLeft: 8 }} className="btn-small">Download SOS JSON</a>
        <a href="/download-shake-intensity" style={{ marginLeft: 8 }} className="btn-small">Download Shake JSON</a>
      </div>

      {loading && <div>Loading logs…</div>}
      {error && <div style={{ color: 'crimson' }}>Error: {error}</div>}

      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        <section style={{ flex: 1, minWidth: 300 }}>
          <h4>SOS Logs ({Array.isArray(sosLogs) ? sosLogs.length : 0})</h4>
          {!sosLogs || sosLogs.length === 0 ? (
            <div className="muted">No SOS logs</div>
          ) : (
            <div className="log-list">
              {sosLogs.slice().reverse().map((item, i) => (
                <div key={i} className="log-item">
                  <div className="log-meta">{item.time || item.timestamp || '—'} — {item.user || item.userProfile?.name || 'Unknown'}</div>
                  <pre className="log-pre">{JSON.stringify(item, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{ flex: 1, minWidth: 300 }}>
          <h4>Shake Intensity ({Array.isArray(shakeLogs) ? shakeLogs.length : 0})</h4>
          {!shakeLogs || shakeLogs.length === 0 ? (
            <div className="muted">No shake intensity logs</div>
          ) : (
            <div className="log-list">
              {shakeLogs.slice().reverse().map((item, i) => (
                <div key={i} className="log-item">
                  <div className="log-meta">{item.timestamp || '—'} — intensity: {item.intensity}</div>
                  <pre className="log-pre">{JSON.stringify(item, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
