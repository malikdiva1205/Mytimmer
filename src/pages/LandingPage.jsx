import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookIcon, ArrowRightIcon, DashboardIcon } from '../components/DoodleIcons';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flashcard-overlay">
      <div className="flashcard" style={{ textAlign: 'center', padding: '52px 48px' }}>
        {/* Book doodle illustration */}
        <div style={{ marginBottom: '28px' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ margin: '0 auto', display: 'block' }}>
            {/* Open book */}
            <rect x="8" y="20" width="64" height="44" rx="5" fill="rgba(197,184,232,0.25)" stroke="#c5b8e8" strokeWidth="1.8" />
            <rect x="38" y="20" width="2.5" height="44" fill="rgba(197,184,232,0.6)" />
            {/* Left page lines */}
            <line x1="16" y1="34" x2="35" y2="34" stroke="#a8b8e8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="42" x2="35" y2="42" stroke="#a8b8e8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="50" x2="30" y2="50" stroke="#a8b8e8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right page lines */}
            <line x1="44" y1="34" x2="63" y2="34" stroke="#f7c5a0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="44" y1="42" x2="63" y2="42" stroke="#f7c5a0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="44" y1="50" x2="58" y2="50" stroke="#f7c5a0" strokeWidth="1.5" strokeLinecap="round" />
            {/* Stars / sparkles */}
            <circle cx="65" cy="14" r="3" fill="#f5e6a0" />
            <circle cx="14" cy="13" r="2" fill="#c5b8e8" />
            <line x1="72" y1="20" x2="72" y2="26" stroke="#f7c5a0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="69" y1="23" x2="75" y2="23" stroke="#f7c5a0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="8" x2="10" y2="14" stroke="#b5d5c5" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="11" x2="13" y2="11" stroke="#b5d5c5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="heading sofia" style={{ fontSize: '2.4rem', marginBottom: '12px' }}>
          Let's start studying
        </h1>
        <p className="subtext" style={{ marginBottom: '36px', lineHeight: 1.7 }}>
          Your calm, focused study companion.<br />
          Track time, sessions, and your progress.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-primary"
            style={{ width: '100%', maxWidth: '280px', padding: '16px 36px', fontSize: '1.05rem' }}
            onClick={() => user ? navigate('/select') : navigate('/auth')}
          >
            Start a Session
            <ArrowRightIcon size={16} color="white" />
          </button>
          <button
            className="btn-secondary"
            style={{ width: '100%', maxWidth: '280px' }}
            onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
          >
            <DashboardIcon size={16} />
            View Dashboard
          </button>
        </div>

        <p style={{ marginTop: '24px', fontSize: '0.78rem', color: 'var(--text-light)' }}>
          Focus · Breathe · Grow · Happy
        </p>
      </div>
    </div>
  );
}
