import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WaveBackground from '../components/WaveBackground';
import {
  SunIcon, CalendarIcon, TrophyIcon, TargetIcon,
  ChartIcon, BoltIcon, HistoryIcon, BookIcon,
  PencilIcon, StartStudyIcon, HomeIcon, DashboardIcon,
} from '../components/DoodleIcons';
import {
  getSessions,
  getTodaySessions,
  getWeekSessions,
  totalDuration,
  formatDuration,
} from '../utils/storage';
import { formatDateLabel } from '../utils/dateUtils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const GOAL_KEY = 'study_daily_goal_hours';

function badgeClass(type) {
  if (!type) return 'badge-clock';
  const t = type.toLowerCase();
  return t.includes('stopwatch') ? 'badge-stopwatch' : t.includes('pomodoro') ? 'badge-pomodoro' : 'badge-clock';
}

function getWeekDayData() {
  const sessions = getSessions();
  const now = new Date();
  const day = now.getDay();
  return DAYS.map((label, i) => {
    const diff = i - day;
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    const dateStr = d.toISOString().split('T')[0];
    const daySessions = sessions.filter(s => s.date === dateStr);
    return { label, seconds: totalDuration(daySessions), isToday: i === day };
  });
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [todaySessions, setTodaySessions] = useState([]);
  const [weekSessions, setWeekSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [weekDays, setWeekDays] = useState([]);

  const [goalHours, setGoalHours] = useState(() => {
    const saved = localStorage.getItem(GOAL_KEY);
    return saved ? parseFloat(saved) : 2;
  });
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  const refresh = () => {
    setTodaySessions(getTodaySessions());
    setWeekSessions(getWeekSessions());
    setAllSessions(getSessions().reverse().slice(0, 8));
    setWeekDays(getWeekDayData());
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('focus', handler);
    return () => window.removeEventListener('focus', handler);
  }, []);

  const saveGoal = () => {
    const val = parseFloat(goalInput);
    if (!isNaN(val) && val > 0 && val <= 24) {
      setGoalHours(val);
      localStorage.setItem(GOAL_KEY, String(val));
    }
    setEditingGoal(false);
  };

  const todayTotal = totalDuration(todaySessions);
  const weekTotal = totalDuration(weekSessions);
  const maxWeekDay = Math.max(...weekDays.map(d => d.seconds), 1);
  const goalSeconds = goalHours * 3600;
  const goalProgress = Math.min(todayTotal / goalSeconds, 1);

  return (
    <>
      <WaveBackground />
      <div className="dashboard-layout">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">My Dashboard</h1>
            <p className="dashboard-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon"><SunIcon size={22} color="#c5a060" /></span>
            <div className="stat-value">{formatDuration(todayTotal) || '0m'}</div>
            <div className="stat-label">Today</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><CalendarIcon size={22} color="#7a6a9a" /></span>
            <div className="stat-value">{formatDuration(weekTotal) || '0m'}</div>
            <div className="stat-label">This Week</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"><TrophyIcon size={22} color="#9a8040" /></span>
            <div className="stat-value">{getSessions().length}</div>
            <div className="stat-label">Sessions</div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="dashboard-section">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TargetIcon size={18} color="#9a6a4a" /> Daily Goal
            </span>
            {!editingGoal ? (
              <button
                onClick={() => { setGoalInput(String(goalHours)); setEditingGoal(true); }}
                style={{
                  background: 'rgba(197,184,232,0.18)',
                  border: '1.5px solid rgba(197,184,232,0.5)',
                  borderRadius: '50px',
                  padding: '4px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-medium)',
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  transition: 'all 0.25s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(197,184,232,0.35)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(197,184,232,0.18)'}
              >
                <PencilIcon size={13} /> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="number"
                  min="0.5" max="24" step="0.5"
                  value={goalInput}
                  onChange={e => setGoalInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveGoal()}
                  autoFocus
                  style={{
                    width: '64px',
                    background: 'rgba(255,255,255,0.7)',
                    border: '1.5px solid var(--lavender)',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '1rem',
                    color: 'var(--text-dark)',
                    outline: 'none',
                    textAlign: 'center',
                  }}
                />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-medium)' }}>hrs</span>
                <button onClick={saveGoal} style={{ background: 'linear-gradient(135deg, #c5b8e8, #a8b8e8)', border: 'none', borderRadius: '50px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                  Save
                </button>
                <button onClick={() => setEditingGoal(false)} style={{ background: 'transparent', border: 'none', fontSize: '0.9rem', color: 'var(--text-light)', cursor: 'pointer', padding: '4px' }}>
                  ✕
                </button>
              </div>
            )}
          </div>
          <div className="progress-bar-container">
            <div className="progress-label">
              <span>Today's progress</span>
              <span>{formatDuration(todayTotal)} / {goalHours}h goal</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${goalProgress * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Week chart */}
        <div className="dashboard-section">
          <div className="section-title">
            <ChartIcon size={18} color="#7a6a9a" /> This Week
          </div>
          <div className="week-bars">
            {weekDays.map((d) => (
              <div className="week-bar-wrap" key={d.label}>
                <div
                  className="week-bar"
                  style={{
                    height: `${(d.seconds / maxWeekDay) * 60}px`,
                    background: d.isToday
                      ? 'linear-gradient(180deg, #f7c5a0, #c5b8e8)'
                      : 'linear-gradient(180deg, var(--lavender), var(--soft-blue))',
                    opacity: d.seconds === 0 ? 0.2 : 1,
                  }}
                />
                <span className="week-day-label" style={{ fontWeight: d.isToday ? 700 : 600, color: d.isToday ? 'var(--text-dark)' : 'var(--text-light)' }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-title">
            <BoltIcon size={18} color="#8a7a50" /> Quick Actions
          </div>
          <div className="quick-actions">
            <button className="quick-btn primary-btn" onClick={() => navigate('/select')}>
              <StartStudyIcon size={16} color="white" /> Start Study
            </button>
            <button className="quick-btn" onClick={() => navigate('/calendar')}>
              <CalendarIcon size={16} /> View Calendar
            </button>
            <button className="quick-btn" onClick={() => navigate('/')}>
              <HomeIcon size={16} /> Home
            </button>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="dashboard-section">
          <div className="section-title">
            <HistoryIcon size={18} color="#6a7a8a" /> Recent Sessions
          </div>
          {allSessions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <BookIcon size={36} color="var(--text-light)" />
              </span>
              No sessions yet. Start studying to see your history here!
            </div>
          ) : (
            <div className="session-list">
              {allSessions.map(s => (
                <div className="session-item" key={s.id}>
                  <span className={`session-type-badge ${badgeClass(s.type)}`}>{s.type}</span>
                  <span className="session-time">{formatDuration(s.duration)}</span>
                  <span className="session-date">{formatDateLabel(s.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
