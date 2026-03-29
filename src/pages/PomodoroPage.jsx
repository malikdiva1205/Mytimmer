import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import Flashcard from '../components/Flashcard';
import { PomodoroIcon, PlayIcon, PauseIcon, ResetIcon, SaveIcon, CheckIcon, VolumeOnIcon, VolumeOffIcon } from '../components/DoodleIcons';
import { saveSession } from '../utils/storage';
import { formatTime, todayStr } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

const RING_R = 72;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

let sharedAudioCtx = null;
function initAudio() {
  if (!sharedAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) sharedAudioCtx = new AudioContext();
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  // Play silent sound to unlock iOS Web Audio
  try {
    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);
    osc.start(sharedAudioCtx.currentTime);
    osc.stop(sharedAudioCtx.currentTime + 0.01);
  } catch(e) {}
}

function playSoftChime() {
  if (!sharedAudioCtx) return;
  const osc = sharedAudioCtx.createOscillator();
  const gain = sharedAudioCtx.createGain();
  osc.connect(gain);
  gain.connect(sharedAudioCtx.destination);
  
  // Triangle wave is easier to hear on phone/laptop speakers
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(880, sharedAudioCtx.currentTime); // A5
  osc.frequency.setValueAtTime(1318.51, sharedAudioCtx.currentTime + 0.15); // E6
  
  gain.gain.setValueAtTime(0, sharedAudioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(1, sharedAudioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + 1.2);
  
  osc.start(sharedAudioCtx.currentTime);
  osc.stop(sharedAudioCtx.currentTime + 1.2);
}

export default function PomodoroPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = useState('25');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [status, setStatus] = useState('idle');
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const soundEnabledRef = useRef(soundEnabled);

  const remainingRef = useRef(remaining);
  useEffect(() => { remainingRef.current = remaining; }, [remaining]);

  const totalSecondsRef = useRef(totalSeconds);
  useEffect(() => { totalSecondsRef.current = totalSeconds; }, [totalSeconds]);

  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  const savedRef = useRef(saved);
  useEffect(() => { savedRef.current = saved; }, [saved]);

  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setInput(val);
  };

  const handleStart = () => {
    initAudio(); // Warm up audio context on user gesture
    const mins = parseInt(input, 10);
    if (!mins || mins <= 0) return;
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemaining(secs);
    setStatus('running');
    setSaved(false);
    startTimeRef.current = new Date();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setStatus('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setStatus('paused');
  };

  const handleResume = () => {
    initAudio();
    setStatus('running');
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setStatus('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setStatus('idle');
    setRemaining(totalSeconds);
    setSaved(false);
  };

  const handleSave = async () => {
    const spent = totalSeconds - remaining;
    if (spent <= 0) return;

    // Stop if running
    if (status === 'running') {
      clearInterval(intervalRef.current);
    }

    const now = new Date();
    const sessionData = {
      type: 'Pomodoro',
      duration: spent,
      startTime: startTimeRef.current?.toISOString() || now.toISOString(),
      endTime: now.toISOString(),
      date: todayStr(),
    };
    saveSession(sessionData);

    if (user) {
      try {
        await fetch(`${API_BASE}/api/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            type: sessionData.type,
            duration: sessionData.duration,
            date: sessionData.date
          })
        });
      } catch (err) {
        console.error('Failed to save to DB', err);
      }
    }

    // Reset to idle
    setStatus('idle');
    setRemaining(totalSeconds);
    setSaved(true);
    triggerToast('Session saved');
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (status === 'done') {
      if (soundEnabledRef.current) playSoftChime();
      triggerToast("Session Complete! Great work 🌸");
    }
  }, [status]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const spent = totalSecondsRef.current - remainingRef.current;
      if (spent > 0 && !savedRef.current && statusRef.current !== 'idle') {
        const now = new Date();
        const sessionData = {
          type: 'Pomodoro',
          duration: spent,
          startTime: startTimeRef.current?.toISOString() || new Date(now.getTime() - spent * 1000).toISOString(),
          endTime: now.toISOString(),
          date: todayStr(),
        };
        saveSession(sessionData);

        if (userRef.current) {
          fetch(`${API_BASE}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userRef.current.id,
              type: sessionData.type,
              duration: sessionData.duration,
              date: sessionData.date
            }),
            keepalive: true
          }).catch(() => {});
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(intervalRef.current);
      
      const spent = totalSecondsRef.current - remainingRef.current;
      if (spent > 0 && !savedRef.current && statusRef.current !== 'idle') {
        const now = new Date();
        const sessionData = {
          type: 'Pomodoro',
          duration: spent,
          startTime: startTimeRef.current?.toISOString() || new Date(now.getTime() - spent * 1000).toISOString(),
          endTime: now.toISOString(),
          date: todayStr(),
        };
        saveSession(sessionData);

        if (userRef.current) {
          fetch(`${API_BASE}/api/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userRef.current.id,
              type: sessionData.type,
              duration: sessionData.duration,
              date: sessionData.date
            }),
            keepalive: true
          }).catch(() => {});
        }
      }
    };
  }, []);

  const progress = status === 'idle' ? 0 : (totalSeconds - remaining) / totalSeconds;
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress);

  const statusLabel = status === 'idle' ? 'Ready' : status === 'running' ? 'Focusing' : status === 'paused' ? 'Paused' : 'Done';
  const statusClass = status === 'running' ? 'status-running' : status === 'paused' ? 'status-paused' : status === 'done' ? 'status-done' : 'status-idle';

  return (
    <Flashcard onBack={async () => {
      const spent = totalSeconds - remaining;
      if (spent > 0 && !saved) await handleSave();
      navigate('/select');
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <PomodoroIcon size={22} color="var(--text-medium)" />
          <h2 className="heading" style={{ margin: 0 }}>Pomodoro</h2>
        </div>
        <p className="subtext" style={{ marginBottom: '16px' }}>Deep focus, one session at a time</p>

        {status === 'idle' && (
          <div className="input-group">
            <label className="input-label">Study duration (minutes)</label>
            <input
              className="styled-input"
              type="number"
              min="1"
              max="180"
              value={input}
              onChange={handleInputChange}
              placeholder="25"
            />
          </div>
        )}

        {status !== 'idle' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <span className={`status-badge ${statusClass}`}>
                {status === 'running' && <span className="pulse-dot" />}
                {statusLabel}
              </span>
            </div>

            <div className="pomodoro-ring-wrap">
              <svg width="168" height="168" viewBox="0 0 168 168">
                <circle cx="84" cy="84" r={RING_R} fill="none" stroke="rgba(197,184,232,0.2)" strokeWidth="10" />
                <circle
                  cx="84" cy="84" r={RING_R}
                  fill="none"
                  stroke="url(#pomGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <defs>
                  <linearGradient id="pomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c5b8e8" />
                    <stop offset="100%" stopColor="#f7c5a0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="ring-text">
                <div className="digital-time" style={{ fontSize: '2.6rem', padding: '0' }}>
                  {formatTime(remaining)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                  {Math.round(progress * 100)}% done
                </div>
              </div>
            </div>
          </>
        )}

        {/* Sound Toggle (visible in all states) */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => {
              initAudio(); // Initialize on click just in case
              setSoundEnabled(!soundEnabled);
            }}
            style={{ 
              background: 'transparent', border: '1px solid rgba(197,184,232,0.4)',
              borderRadius: '50px', padding: '6px 14px', 
              fontSize: '0.8rem', color: 'var(--text-medium)',
              display: 'flex', alignItems: 'center', gap: '6px',
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'Nunito, sans-serif'
            }}
          >
            {soundEnabled ? <VolumeOnIcon size={14} color="#8cc0a8" /> : <VolumeOffIcon size={14} color="#ff6b6b" />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
        </div>

        <div className="btn-row">
          {status === 'idle' && (
            <button className="btn-primary" onClick={handleStart} style={{ width: '100%' }}>
              <PlayIcon size={15} color="white" /> Start Pomodoro
            </button>
          )}
          {status === 'running' && (
            <button className="btn-danger" onClick={handlePause}>
              <PauseIcon size={15} color="white" /> Pause
            </button>
          )}
          {status === 'paused' && (
            <>
              <button className="btn-success" onClick={handleResume}>
                <PlayIcon size={15} color="white" /> Resume
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                <ResetIcon size={15} /> Reset
              </button>
            </>
          )}
          {status === 'done' && (
            <button className="btn-secondary" onClick={handleReset}>
              <ResetIcon size={15} /> New Session
            </button>
          )}
        </div>

        {status !== 'idle' && !saved && totalSeconds - remaining > 0 && (
          <div style={{ marginTop: '12px' }}>
            <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>
              <SaveIcon size={16} color="white" /> Save Session
            </button>
          </div>
        )}
        {saved && (
          <p style={{ marginTop: '14px', fontSize: '0.85rem', color: '#4a7a5a', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckIcon size={15} color="#4a7a5a" /> Session saved to dashboard
          </p>
        )}
      </div>
      {showToast && <div className="toast show">{showToast}</div>}
    </Flashcard>
  );
}
