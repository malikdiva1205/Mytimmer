import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import Flashcard from '../components/Flashcard';
import { WarningIcon } from '../components/DoodleIcons';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorPopup, setErrorPopup] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/select');
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorPopup('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      login(data.user);
      navigate('/select');
    } catch (err) {
      let msg = err.message;
      // Only translate low-level network errors — all API errors show as-is
      if (msg === 'Failed to fetch' || msg === 'Load failed' || msg.includes('NetworkError')) {
        msg = "Can't reach the server right now. Please check your connection and try again.";
      }
      setErrorPopup(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flashcard onBack={() => navigate('/')}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="heading">{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
        <p className="subtext">
          {isLogin ? 'Login to continue your study journey' : 'Create an account to track your sessions'}
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input className="styled-input" type="text" name="name" value={formData.name}
                onChange={handleChange} required placeholder="Your name" />
            </div>
          )}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input className="styled-input" type="email" name="email" value={formData.email}
              onChange={handleChange} required placeholder="hello@example.com" />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="styled-input" type="password" name="password" value={formData.password}
              onChange={handleChange} required placeholder="••••••••" />
          </div>

          <button className="btn-primary" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Signup')}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--lavender)', cursor: 'pointer', fontWeight: 700 }}>
            {isLogin ? 'Signup' : 'Login'}
          </span>
        </p>
      </div>

      {/* Error Popup */}
      {errorPopup && (
        <div className="error-popup-overlay" onClick={() => setErrorPopup('')}>
          <div className="error-popup-box" onClick={e => e.stopPropagation()}>
            <div className="error-popup-icon">
              <WarningIcon size={26} color="#ff6b6b" />
            </div>
            <p className="error-popup-title">Oops, something went wrong</p>
            <p className="error-popup-msg">{errorPopup}</p>
            <button className="error-popup-btn" onClick={() => setErrorPopup('')}>
              Got it
            </button>
          </div>
        </div>
      )}
    </Flashcard>
  );
}
