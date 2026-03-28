import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

function getWeekKey() { return getWeekRange().weekStart; }

function getTimeUntilWeekEnd() {
  const { weekEnd } = getWeekRange();
  const diff = new Date(weekEnd + 'T23:59:59') - new Date();
  if (diff <= 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const WEEKLY_CACHE_KEY = 'leaderboard_weekly_podium';
function loadCachedPodium() {
  try {
    const raw = localStorage.getItem(WEEKLY_CACHE_KEY);
    if (!raw) return null;
    const { weekKey, entries } = JSON.parse(raw);
    if (weekKey !== getWeekKey()) { localStorage.removeItem(WEEKLY_CACHE_KEY); return null; }
    return entries;
  } catch { return null; }
}
function savePodiumCache(entries) {
  localStorage.setItem(WEEKLY_CACHE_KEY, JSON.stringify({ weekKey: getWeekKey(), entries }));
}

const RANK_COLORS = ['#f1c40f', '#b8c2c6', '#d38c44'];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dailyEntries, setDailyEntries]   = useState([]);
  const [weeklyEntries, setWeeklyEntries] = useState(() => loadCachedPodium() || []);
  const [loading, setLoading]             = useState(true);
  const [lastUpdated, setLastUpdated]     = useState(null);
  const [timeUntilMidnight, setTM]        = useState(getTimeUntilMidnight());
  const [timeUntilWeekEnd, setTW]         = useState(getTimeUntilWeekEnd());

  const fetchLeaderboard = useCallback(async () => {
    try {
      const today = todayStr();
      const { weekStart, weekEnd } = getWeekRange();
      const res = await fetch(`${API_BASE}/api/leaderboard?today=${today}&weekStart=${weekStart}&weekEnd=${weekEnd}`);
      if (res.ok) {
        const data = await res.json();
        setDailyEntries(data.daily || []);
        if (data.weekly?.length > 0) { setWeeklyEntries(data.weekly); savePodiumCache(data.weekly); }
        setLastUpdated(new Date());
      }
    } catch (err) { console.error('Leaderboard fetch failed:', err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    const i = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(i);
  }, [fetchLeaderboard]);

  useEffect(() => {
    const i = setInterval(() => { setTM(getTimeUntilMidnight()); setTW(getTimeUntilWeekEnd()); }, 60000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="flashcard" style={{ maxWidth: '760px', width: '100%', padding: '40px 32px', margin: '0 auto', overflow: 'visible' }}>

        {/* ── Nav ── */}
        <div className="flashcard-nav" style={{ marginBottom: '28px' }}>
          <button className="nav-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Dashboard
          </button>
        </div>

        {/* ── Title ── */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ fontFamily: 'Sofia, cursive', fontSize: '2.4rem', color: 'var(--text-dark)', margin: 0 }}>
            Leaderboard
          </h1>
        </div>

        {/* ── Live badge (below title) ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', marginBottom: '36px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf82', boxShadow: '0 0 6px #4caf82', animation: 'pulse 2s infinite', display: 'inline-block' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600 }}>
            Live · updates every 15s
            {lastUpdated && ` · ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </span>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)', fontFamily: 'Nunito, sans-serif' }}>
            Loading rankings…
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* ── Weekly Podium ── */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                <TrophyIcon size={20} color="#f1c40f" />
                <h2 style={{ fontFamily: 'Sofia, cursive', fontSize: '1.6rem', color: 'var(--text-dark)', margin: 0 }}>
                  Weekly Podium
                </h2>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(241,196,15,0.1)', border: '1px solid rgba(241,196,15,0.25)', borderRadius: '50px', padding: '4px 14px', fontSize: '0.71rem', color: '#f1c40f', fontWeight: 600 }}>
                  <ClockIcon size={11} color="#f1c40f" />
                  {timeUntilWeekEnd ? `Resets Sunday midnight · ${timeUntilWeekEnd}` : 'Resets Sunday midnight'}
                </span>
              </div>

              {weeklyEntries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '56px 32px', background: 'var(--bg-nav)', backdropFilter: 'blur(12px)', border: '1.5px solid var(--border-card)', borderRadius: '24px', color: 'var(--text-light)', fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem' }}>
                  <TrophyIcon size={32} color="var(--text-light)" />
                  <p style={{ marginTop: '12px' }}>No study sessions this week yet.</p>
                  <p style={{ marginTop: '4px', fontSize: '0.82rem' }}>Start studying to claim a podium spot!</p>
                </div>
              ) : (
                <DoodlePodium top3={weeklyEntries} />
              )}
            </section>

            {/* ── Today's Rankings ── */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                <CalendarIcon size={18} color="var(--text-dark)" />
                <h2 style={{ fontFamily: 'Sofia, cursive', fontSize: '1.6rem', color: 'var(--text-dark)', margin: 0 }}>
                  Today's Rankings
                </h2>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(168,200,232,0.12)', border: '1px solid rgba(168,200,232,0.3)', borderRadius: '50px', padding: '4px 14px', fontSize: '0.71rem', color: 'var(--text-medium)', fontWeight: 600 }}>
                  <MoonIcon size={11} color="var(--text-medium)" />
                  Resets at midnight · {timeUntilMidnight} left today
                </span>
              </div>

              {dailyEntries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 32px', background: 'var(--bg-nav)', backdropFilter: 'blur(12px)', border: '1.5px solid var(--border-card)', borderRadius: '20px', color: 'var(--text-light)', fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem' }}>
                  <TrophyIcon size={32} color="var(--text-light)" />
                  <p style={{ marginTop: '12px' }}>No sessions today. Start studying to appear here!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dailyEntries.map((entry, i) => {
                    const isMe = user && entry.id === user.id;
                    const rankColor = RANK_COLORS[i] || 'var(--text-light)';
                    return (
                      <div key={`daily-${entry.id}`} style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        background: isMe ? 'linear-gradient(135deg,rgba(197,184,232,0.22),rgba(168,184,232,0.18))' : 'var(--bg-nav)',
                        border: `1.5px solid ${isMe ? 'rgba(197,184,232,0.6)' : 'rgba(197,184,232,0.25)'}`,
                        borderRadius: '18px', padding: '15px 20px', transition: 'all 0.25s ease',
                      }}>
                        <div style={{ minWidth: '40px', display: 'flex', justifyContent: 'center' }}>
                          {i === 0 ? <TrophyIcon size={20} color={rankColor} />
                           : i < 3  ? <StarIcon   size={18} color={rankColor} />
                           : <span style={{ fontSize: '0.95rem', color: 'var(--text-light)', fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>#{i + 1}</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {entry.name}
                            {isMe && <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: '50px', background: 'rgba(197,184,232,0.4)', color: 'var(--text-dark)', letterSpacing: '0.4px' }}>YOU</span>}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-medium)', marginTop: '3px' }}>
                            {entry.session_count} session{entry.session_count !== '1' ? 's' : ''} today
                          </div>
                        </div>
                        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: i < 3 ? rankColor : 'var(--text-dark)', whiteSpace: 'nowrap' }}>
                          {formatTime(entry.total_time)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          </div>
        )}

        {/* Footer */}
        {(dailyEntries.length > 0 || weeklyEntries.length > 0) && (
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-medium)', marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <PencilIcon size={13} color="var(--text-medium)" />
            Rankings update automatically as you study
          </p>
        )}
      </div>
    </div>
  );
}
