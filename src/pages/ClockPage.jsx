import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { ClockIcon, SunIcon, MoonIcon, DashboardIcon } from '../components/DoodleIcons';
import { getCurrentTimeStr } from '../utils/dateUtils';

export default function ClockPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(getCurrentTimeStr());
  const [sessionStart] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeStr());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const hour = now.getHours();
  const greetingText =
    hour < 12 ? 'Good Morning' :
    hour < 17 ? 'Good Afternoon' :
    hour < 20 ? 'Good Evening' : 'Good Night';

  const GreetingIcon = hour < 17 ? SunIcon : MoonIcon;

  return (
    <Flashcard onBack={() => navigate('/select')}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <ClockIcon size={22} color="var(--text-medium)" />
          <h2 className="heading" style={{ margin: 0 }}>Clock</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
          <GreetingIcon size={15} color="var(--text-light)" />
          <p className="subtext" style={{ margin: 0 }}>{greetingText}</p>
        </div>

        <div className="digital-time digital-time-large" style={{ margin: '8px 0 16px' }}>
          {time}
        </div>

        <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', marginBottom: '28px' }}>
          {dateLabel}
        </p>

        <div
          style={{
            background: 'rgba(197,184,232,0.12)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 20px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: 600 }}>
            Session started
          </span>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
            {sessionStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="btn-row">
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            <DashboardIcon size={16} color="white" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </Flashcard>
  );
}
