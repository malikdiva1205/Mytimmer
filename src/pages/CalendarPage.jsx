import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import WaveBackground from '../components/WaveBackground';
import { CalendarIcon, DashboardIcon, BookIcon } from '../components/DoodleIcons';
import { getSessions, getSessionsByDate, totalDuration, formatDuration } from '../utils/storage';
import { getDaysInMonth, getFirstDayOfMonth, monthName, formatDateLabel, todayStr } from '../utils/dateUtils';

function badgeClass(type) {
  const t = (type || '').toLowerCase();
  return t.includes('stopwatch') ? 'badge-stopwatch' : t.includes('pomodoro') ? 'badge-pomodoro' : 'badge-clock';
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);

  const activeDates = useMemo(() => {
    const sessions = getSessions();
    return new Set(sessions.map(s => s.date));
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = todayStr();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  const handleDayClick = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelected(dateStr === selected ? null : dateStr);
  };

  const selectedSessions = selected ? getSessionsByDate(selected) : [];
  const selectedTotal = totalDuration(selectedSessions);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const toDateStr = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <>
      <WaveBackground />
      <div className="calendar-layout">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'Sofia, cursive', fontSize: '1.9rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarIcon size={26} color="var(--text-medium)" /> Calendar
          </h1>
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>
            <DashboardIcon size={14} />
            Dashboard
          </button>
        </div>

        {/* Calendar card */}
        <div className="dashboard-section">
          <div className="calendar-header-row">
            <button className="cal-nav-btn" onClick={prevMonth}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="calendar-month-title">{monthName(month)} {year}</div>
            <button className="cal-nav-btn" onClick={nextMonth}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div className="cal-day-header" key={d}>{d}</div>
            ))}
            {days.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} className="cal-day empty" />;
              const dateStr = toDateStr(day);
              const hasActivity = activeDates.has(dateStr);
              const isToday = dateStr === today;
              const isSelected = dateStr === selected;
              return (
                <div
                  key={dateStr}
                  className={`cal-day${hasActivity ? ' has-activity' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                  {hasActivity && <span className="activity-dot" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[
            { color: 'linear-gradient(135deg, var(--lavender-light), var(--soft-blue-light))', border: '1px solid rgba(197,184,232,0.5)', label: 'Study day' },
            { color: 'linear-gradient(135deg, #c5b8e8, #a8b8e8)', border: 'none', label: 'Today' },
            { dot: true, label: 'Has sessions' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-medium)' }}>
              {item.dot
                ? <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--lavender)' }} />
                : <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color, border: item.border }} />
              }
              {item.label}
            </div>
          ))}
        </div>

        {/* Selected day detail */}
        {selected && (
          <div className="day-detail-panel">
            <div className="section-title">
              <CalendarIcon size={16} color="var(--text-medium)" /> {formatDateLabel(selected)}
            </div>
            {selectedSessions.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <span style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                  <BookIcon size={32} color="var(--text-light)" />
                </span>
                No sessions on this day.
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: 600 }}>Total: </span>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--text-dark)' }}>
                    {formatDuration(selectedTotal)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', marginLeft: '8px' }}>
                    ({selectedSessions.length} session{selectedSessions.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="session-list">
                  {selectedSessions.map(s => (
                    <div className="session-item" key={s.id}>
                      <span className={`session-type-badge ${badgeClass(s.type)}`}>{s.type}</span>
                      <span className="session-time">{formatDuration(s.duration)}</span>
                      <span className="session-date" style={{ fontSize: '0.75rem' }}>
                        {s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {!selected && (
          <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.88rem', padding: '12px 0' }}>
            Click a day to see session details
          </div>
        )}
      </div>
    </>
  );
}
