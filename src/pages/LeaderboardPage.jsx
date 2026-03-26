import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import WaveBackground from '../components/WaveBackground';
import { TrophyIcon, HomeIcon } from '../components/DoodleIcons';
import { API_BASE } from '../config';
import { useAuth } from '../context/AuthContext';

function formatTime(seconds) {
  const s = Number(seconds) || 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

const MEDALS = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = [
  { border: 'rgba(255, 215, 0, 0.5)', glow: 'rgba(255, 215, 0, 0.15)', rank: '#FFD700' },
  { border: 'rgba(192, 192, 192, 0.5)', glow: 'rgba(192, 192, 192, 0.12)', rank: '#C0C0C0' },
  { border: 'rgba(205, 127, 50, 0.5)',  glow: 'rgba(205, 127, 50, 0.12)',  rank: '#CD7F32' },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard`);
      if (res.ok) {
        setEntries(await res.json());
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Leaderboard fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return (
    <>
      <WaveBackground />
      <div style={{
        minHeight: '100vh',
        padding: '28px 20px 48px',
        maxWidth: '680px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingTop: '8px' }}>
          <div>
            <h1 style={{ fontFamily: 'Sofia, cursive', fontSize: '2rem', color: 'var(--text-dark)', margin: 0 }}>
              Leaderboard
            </h1>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-light)', marginTop: '4px' }}>
              Ranked by total study time
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
            style={{ padding: '9px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HomeIcon size={15} /> Dashboard
          </button>
        </div>

        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#4caf82',
            boxShadow: '0 0 6px #4caf82',
            animation: 'pulse 2s infinite',
            display: 'inline-block',
          }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>
            Live · updates every 15s
            {lastUpdated && ` · ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)', fontFamily: 'Nunito, sans-serif' }}>
            Loading rankings…
          </div>
        ) : entries.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)', backdropFilter: 'blur(12px)',
            border: '1.5px solid var(--border-card)', borderRadius: '20px',
            padding: '48px 32px', textAlign: 'center',
            color: 'var(--text-light)', fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem',
          }}>
            <TrophyIcon size={36} color="var(--text-light)" />
            <p style={{ marginTop: '14px' }}>No sessions yet. Start studying to appear here!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entries.map((entry, i) => {
              const isTop3 = i < 3;
              const isMe = user && entry.id === user.id;
              const medal = MEDAL_COLORS[i];

              return (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: isMe
                      ? 'linear-gradient(135deg, rgba(197,184,232,0.25), rgba(168,184,232,0.2))'
                      : isTop3
                        ? medal.glow
                        : 'var(--bg-card)',
                    backdropFilter: 'blur(12px)',
                    border: `1.5px solid ${isMe ? 'rgba(197,184,232,0.7)' : isTop3 ? medal.border : 'var(--border-card)'}`,
                    borderRadius: '18px',
                    padding: '16px 20px',
                    boxShadow: isTop3 ? `0 4px 20px ${medal.glow}` : 'var(--shadow-card)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Rank / Medal */}
                  <div style={{
                    minWidth: '44px',
                    textAlign: 'center',
                    fontSize: isTop3 ? '1.6rem' : '1rem',
                    fontFamily: 'Share Tech Mono, monospace',
                    color: isTop3 ? medal.rank : 'var(--text-light)',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}>
                    {isTop3 ? MEDALS[i] : `#${i + 1}`}
                  </div>

                  {/* Name + sessions */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      {entry.name}
                      {isMe && (
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
                          borderRadius: '50px',
                          background: 'rgba(197,184,232,0.4)',
                          color: 'var(--text-medium)',
                          letterSpacing: '0.4px',
                        }}>YOU</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '3px' }}>
                      {entry.session_count} session{entry.session_count !== '1' ? 's' : ''}
                    </div>
                  </div>

                  {/* Time */}
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: isTop3 ? medal.rank : 'var(--text-dark)',
                    whiteSpace: 'nowrap',
                  }}>
                    {formatTime(entry.total_time)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh hint */}
        {entries.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '28px' }}>
            Rankings update automatically as you study 📚
          </p>
        )}
      </div>
    </>
  );
}
