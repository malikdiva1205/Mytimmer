import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from './DoodleIcons';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border-card)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition)',
        color: 'var(--text-medium)',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(12deg)';
        e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.backgroundColor = 'var(--bg-card)';
      }}
    >
      {theme === 'light' ? (
        <MoonIcon size={20} color="var(--text-medium)" />
      ) : (
        <SunIcon size={22} color="var(--yellow-soft)" />
      )}
    </button>
  );
}
