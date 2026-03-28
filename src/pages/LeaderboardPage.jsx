import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { TrophyIcon, StarIcon, PencilIcon, CalendarIcon, ClockIcon, MoonIcon } from '../components/DoodleIcons';
import DoodlePodium from '../components/DoodlePodium';
import { API_BASE } from '../config';
import { useAuth } from '../context/AuthContext';
import { todayStr, getWeekRange } from '../utils/dateUtils';

function formatTime(seconds) {
  const s = Number(seconds) || 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

// Get the current week key as "YYYY-Www" so we can detect week changes
function getWeekKey() {
  const { weekStart } = getWeekRange();
  return weekStart; // e.g. "2026-03-23"
}

// Get a user-friendly "Week of Mar 23 – Mar 29" label
function getWeekLabel() {
  const { weekStart, weekEnd } = getWeekRange();
  const fmt = (str) =>
    new Date(str + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `Week of ${fmt(weekStart)} – ${fmt(weekEnd)}`;
}

// How long until Sunday midnight (end of week)?
function getTimeUntilWeekEnd() {
  const { weekEnd } = getWeekRange();
  const endDate = new Date(weekEnd + 'T23:59:59');
  const diff = endDate - new Date();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

// How long until midnight tonight?
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const WEEKLY_CACHE_KEY = 'leaderboard_weekly_podium';

// Load cached podium — returns null if it's from a different week
function loadCachedPodium() {
  try {
    const raw = localStorage.getItem(WEEKLY_CACHE_KEY);
    if (!raw) return null;
    const { weekKey, entries } = JSON.parse(raw);
    if (weekKey !== getWeekKey()) {
      localStorage.removeItem(WEEKLY_CACHE_KEY);
      return null;
    }
    return entries;
  } catch {
    return null;
  }
}

// Save the podium to cache for this week
function savePodiumCache(entries) {
  localStorage.setItem(
    WEEKLY_CACHE_KEY,
    JSON.stringify({ weekKey: getWeekKey(), entries })
  );
}

const MEDAL_COLORS = [
  { border: 'rgba(255, 215, 0, 0.5)', glow: 'rgba(255, 215, 0, 0.15)', rank: '#FFD700', icon: TrophyIcon },
  { border: 'rgba(192, 192, 192, 0.5)', glow: 'rgba(192, 192, 192, 0.12)', rank: '#C0C0C0', icon: StarIcon },
  { border: 'rgba(205, 127, 50, 0.5)',  glow: 'rgba(205, 127, 50, 0.12)',  rank: '#CD7F32', icon: StarIcon },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dailyEntries, setDailyEntries] = useState([]);
  // Weekly podium: starts from cache if available
  const [weeklyEntries, setWeeklyEntries] = useState(() => loadCachedPodium() || []);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState(getTimeUntilMidnight());
  const [timeUntilWeekEnd, setTimeUntilWeekEnd] = useState(getTimeUntilWeekEnd());

  const fetchLeaderboard = useCallback(async () => {
    try {
      const today = todayStr();
      const { weekStart, weekEnd } = getWeekRange();
      const res = await fetch(`${API_BASE}/api/leaderboard?today=${today}&weekStart=${weekStart}&weekEnd=${weekEnd}`);
      if (res.ok) {
        const data = await res.json();
        setDailyEntries(data.daily || []);
        // Always update weekly — the cache just pre-fills the initial render
        if (data.weekly && data.weekly.length > 0) {
          setWeeklyEntries(data.weekly);
          savePodiumCache(data.weekly);
        }
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
    const dataInterval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(dataInterval);
  }, [fetchLeaderboard]);

  // Update the countdown timers every minute
  useEffect(() => {
    const tick = () => {
      setTimeUntilMidnight(getTimeUntilMidnight());
      setTimeUntilWeekEnd(getTimeUntilWeekEnd());
    };
    const timerInterval = setInterval(tick, 60000);
    return () => clearInterval(timerInterval);
  }, []);

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
            Daily rankings &amp; Weekly podium
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
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* ══════════════ WEEKLY PODIUM ══════════════ */}
            <div>
              {/* Section header */}
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontFamily: 'Sofia, cursive', fontSize: '1.7rem', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <TrophyIcon size={22} color="#c9a800" />
                  Weekly Podium
                </h2>
              </div>

              {/* Reset badge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(201, 168, 0, 0.1)',
                  border: '1px solid rgba(201,168,0,0.25)',
                  borderRadius: '50px',
                  padding: '4px 12px',
                  fontSize: '0.72rem',
                  color: '#a08600',
                  fontWeight: 600,
                  fontFamily: 'Nunito, sans-serif',
                }}>
                  <ClockIcon size={12} color="#a08600" />
                  {timeUntilWeekEnd
                    ? `Resets Sunday midnight · ${timeUntilWeekEnd}`
                    : 'Resets Sunday midnight'}
                </span>
              </div>

              {weeklyEntries.length === 0 ? (
                <div style={{
                  background: 'var(--bg-nav)', backdropFilter: 'blur(12px)',
                  border: '1.5px solid var(--border-card)', borderRadius: '20px',
                  padding: '48px 32px', textAlign: 'center',
                  color: 'var(--text-light)', fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem',
                }}>
                  <TrophyIcon size={36} color="var(--text-light)" />
                  <p style={{ marginTop: '14px' }}>No study sessions this week yet.</p>
                  <p style={{ marginTop: '6px', fontSize: '0.82rem' }}>Start studying to claim a podium spot!</p>
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.06), rgba(197,184,232,0.08))',
                  border: '1.5px solid rgba(201,168,0,0.18)',
                  borderRadius: '24px',
                  padding: '8px 8px 16px',
                }}>
                  <DoodlePodium top3={weeklyEntries} />
                </div>
              )}
            </div>

            {/* ══════════════ DAILY LEADERBOARD ══════════════ */}
            <div>
              {/* Section header */}
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontFamily: 'Sofia, cursive', fontSize: '1.7rem', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CalendarIcon size={20} color="var(--text-dark)" />
                  Today's Rankings
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '4px' }}>
                  Study hours for today only
                </p>
              </div>

              {/* Reset badge */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(168,200,232,0.12)',
                  border: '1px solid rgba(168,200,232,0.3)',
                  borderRadius: '50px',
                  padding: '4px 12px',
                  fontSize: '0.72rem',
                  color: 'var(--text-medium)',
                  fontWeight: 600,
                  fontFamily: 'Nunito, sans-serif',
                }}>
                  <MoonIcon size={12} color="var(--text-medium)" />
                  Resets at midnight · {timeUntilMidnight} left today
                </span>
              </div>

              {dailyEntries.length === 0 ? (
                <div style={{
                  background: 'var(--bg-nav)', backdropFilter: 'blur(12px)',
                  border: '1.5px solid var(--border-card)', borderRadius: '20px',
                  padding: '48px 32px', textAlign: 'center',
                  color: 'var(--text-light)', fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem',
                }}>
                  <TrophyIcon size={36} color="var(--text-light)" />
                  <p style={{ marginTop: '14px' }}>No sessions today. Start studying to appear here!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dailyEntries.map((entry, i) => {
                    const isMe = user && entry.id === user.id;
                    const medal = MEDAL_COLORS[i];

                    return (
                      <div
                        key={`daily-${entry.id}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          background: isMe
                            ? 'linear-gradient(135deg, rgba(197,184,232,0.25), rgba(168,184,232,0.2))'
                            : 'var(--bg-nav)',
                          border: `1.5px solid ${isMe ? 'rgba(197,184,232,0.7)' : 'rgba(197,184,232,0.3)'}`,
                          borderRadius: '18px', padding: '16px 20px',
                          transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                        }}
                      >
                        {/* Rank / medal */}
                        <div style={{
                          minWidth: '44px', textAlign: 'center',
                          fontFamily: 'Share Tech Mono, monospace', color: medal ? medal.rank : 'var(--text-light)',
                          fontWeight: 700, lineHeight: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                          {medal
                            ? <medal.icon size={22} color={medal.rank} />
                            : <span style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>#{i + 1}</span>
                          }
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {entry.name}
                            {isMe && <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', background: 'rgba(197,184,232,0.4)', color: 'var(--text-dark)', letterSpacing: '0.4px' }}>YOU</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)', marginTop: '4px' }}>
                            {entry.session_count} session{entry.session_count !== '1' ? 's' : ''} today
                          </div>
                        </div>

                        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '1.3rem', fontWeight: 700, color: medal ? medal.rank : 'var(--text-dark)', whiteSpace: 'nowrap' }}>
                          {formatTime(entry.total_time)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer hint */}
        {(dailyEntries.length > 0 || weeklyEntries.length > 0) && (
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
