import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { TrophyIcon, StarIcon, PencilIcon, BookIcon } from '../components/DoodleIcons';
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

const MEDAL_COLORS = [
  { border: 'rgba(255, 215, 0, 0.5)', glow: 'rgba(255, 215, 0, 0.15)', rank: '#FFD700', icon: TrophyIcon },
  { border: 'rgba(192, 192, 192, 0.5)', glow: 'rgba(192, 192, 192, 0.12)', rank: '#C0C0C0', icon: StarIcon },
  { border: 'rgba(205, 127, 50, 0.5)',  glow: 'rgba(205, 127, 50, 0.12)',  rank: '#CD7F32', icon: StarIcon },
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
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div 
        className="flashcard"
        style={{ maxWidth: '760px', width: '100%', padding: '40px 32px', margin: '0 auto', overflow: 'visible' }}
      >
        <div className="flashcard-nav" style={{ position: 'relative', top: 0, left: 0, right: 0, marginBottom: '24px' }}>
          <button className="nav-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button className="nav-btn" onClick={() => navigate('/dashboard')} title="Go to Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Dashboard
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontFamily: 'Sofia, cursive', fontSize: '2.4rem', color: 'var(--text-dark)', margin: 0 }}>
            Leaderboard
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '6px' }}>
            Ranked by total study time
          </p>
        </div>

        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
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
            background: 'var(--bg-nav)', backdropFilter: 'blur(12px)',
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
              const Icon = isTop3 ? medal.icon : null;

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
                        : 'var(--bg-nav)',
                    border: `1.5px solid ${isMe ? 'rgba(197,184,232,0.7)' : isTop3 ? medal.border : 'rgba(197,184,232,0.3)'}`,
                    borderRadius: '18px',
                    padding: '16px 20px',
                    boxShadow: isTop3 ? `0 4px 20px ${medal.glow}` : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Rank / Medal */}
                  <div style={{
                    minWidth: '44px',
                    textAlign: 'center',
                    fontFamily: 'Share Tech Mono, monospace',
                    color: isTop3 ? medal.rank : 'var(--text-light)',
                    fontWeight: 700,
                    lineHeight: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {isTop3 ? <Icon size={24} color={medal.rank} /> : <span style={{ fontSize: '1.2rem' }}>#{i + 1}</span>}
                  </div>

                  {/* Name + sessions */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Nunito, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'var(--text-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      {entry.name}
                      {isMe && (
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px',
                          borderRadius: '50px',
                          background: 'rgba(197,184,232,0.4)',
                          color: 'var(--text-dark)',
                          letterSpacing: '0.4px',
                        }}>YOU</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                      {entry.session_count} session{entry.session_count !== '1' ? 's' : ''}
                    </div>
                  </div>

                  {/* Time */}
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '1.3rem',
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
          <p style={{ 
            textAlign: 'center', 
            fontSize: '0.8rem', 
            color: 'var(--text-medium)', 
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <PencilIcon size={14} color="var(--text-medium)" />
            Rankings update automatically as you study 
          </p>
        )}
      </div>
    </div>
  );
}
