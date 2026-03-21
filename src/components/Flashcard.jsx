import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable Flashcard wrapper with Back and Exit (Dashboard) buttons.
 * @prop {Function} onBack - handler for back button; pass null to hide it
 * @prop {string} exitTo - route for exit button, defaults to '/dashboard'
 * @prop {React.ReactNode} children
 */
export default function Flashcard({ onBack, exitTo = '/dashboard', children, style }) {
  const navigate = useNavigate();

  return (
    <div className="flashcard-overlay">
      <div className="flashcard" style={style}>
        <div className="flashcard-nav">
          {onBack ? (
            <button className="nav-btn" onClick={onBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
          ) : (
            <span />
          )}
          <button className="nav-btn" onClick={() => navigate(exitTo)} title="Go to Dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Dashboard
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
