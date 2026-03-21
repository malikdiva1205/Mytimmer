// Get today's date as YYYY-MM-DD
export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// Format a YYYY-MM-DD string to a readable date
export function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Get days in a month
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Get first weekday of a month (0=Sun)
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// Format seconds into display string
export function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(m)}:${pad(s)}`;
}

// Current time as HH:MM:SS
export function getCurrentTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// Month name
export function monthName(month) {
  return new Date(2000, month, 1).toLocaleString('en-US', { month: 'long' });
}
