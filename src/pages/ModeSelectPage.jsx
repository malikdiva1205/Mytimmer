import React from 'react';
import { useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { ClockIcon, StopwatchIcon, PomodoroIcon, BackIcon } from '../components/DoodleIcons';

const modes = [
  {
    id: 'clock',
    icon: <ClockIcon size={22} color="#4a7a9a" />,
    label: 'Clock',
    desc: 'Display real-time current time',
    route: '/clock',
    className: 'clock',
  },
  {
    id: 'stopwatch',
    icon: <StopwatchIcon size={22} color="#4a7a5a" />,
    label: 'Stopwatch',
    desc: 'Track elapsed time with precision',
    route: '/stopwatch',
    className: 'stopwatch',
  },
  {
    id: 'pomodoro',
    icon: <PomodoroIcon size={22} color="#9a5a3a" />,
    label: 'Pomodoro',
    desc: 'Focus intervals with custom duration',
    route: '/pomodoro',
    className: 'pomodoro',
  },
];

export default function ModeSelectPage() {
  const navigate = useNavigate();

  return (
    <Flashcard onBack={() => navigate('/')}>
      <h2 className="heading">Choose your mode</h2>
      <p className="subtext">How would you like to study today?</p>

      <div className="mode-grid">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className="mode-card"
            onClick={() => navigate(mode.route)}
            style={{ width: '100%', background: 'none', font: 'inherit' }}
          >
            <div className={`mode-icon ${mode.className}`}>
              {mode.icon}
            </div>
            <div>
              <div className="mode-label">{mode.label}</div>
              <div className="mode-desc">{mode.desc}</div>
            </div>
            <svg
              style={{ marginLeft: 'auto', color: 'var(--text-light)' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    </Flashcard>
  );
}
