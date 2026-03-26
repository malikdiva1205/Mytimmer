// Storage keys
const SESSIONS_KEY = 'study_sessions';
import { todayStr } from './dateUtils';

// Get all sessions
export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
  } catch {
    return [];
  }
}

// Save a new session
export function saveSession(session) {
  const sessions = getSessions();
  const newSession = {
    id: Date.now(),
    type: session.type,       // 'Clock' | 'Stopwatch' | 'Pomodoro'
    duration: session.duration, // seconds
    startTime: session.startTime,
    endTime: session.endTime,
    date: session.date,       // 'YYYY-MM-DD'
    ...session,
  };
  sessions.push(newSession);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  return newSession;
}

// Get sessions for a specific date (YYYY-MM-DD)
export function getSessionsByDate(date) {
  return getSessions().filter(s => s.date === date);
}

// Get sessions for today
export function getTodaySessions() {
  return getSessionsByDate(todayStr());
}

// Get sessions for the current week (Mon-Sun)
export function getWeekSessions() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  const sessions = getSessions();
  return sessions.filter(s => {
    const d = new Date(s.date);
    return d >= monday;
  });
}

// Total duration in seconds for a sessions array
export function totalDuration(sessions) {
  return sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
}

// Format seconds to HH:MM:SS or MM:SS
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Get all unique dates that have sessions
export function getActiveDates() {
  const sessions = getSessions();
  return [...new Set(sessions.map(s => s.date))];
}
