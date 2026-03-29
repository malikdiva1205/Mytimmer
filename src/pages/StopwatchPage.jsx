import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import Flashcard from '../components/Flashcard';
import { StopwatchIcon, PlayIcon, PauseIcon, ResetIcon, SaveIcon, CheckIcon } from '../components/DoodleIcons';
import { saveSession } from '../utils/storage';
import { formatTime, todayStr } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

export default function StopwatchPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('idle');
  const [saved, setSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const accumulatedRef = useRef(0);

  const elapsedRef = useRef(elapsed);
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);
  
  const savedRef = useRef(saved);
  useEffect(() => { savedRef.current = saved; }, [saved]);

  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  const tick = () => {
    setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000) + accumulatedRef.current);
  };

  const handleStart = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(tick, 500);
    setStatus('running');
    setSaved(false);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    accumulatedRef.current = elapsed;
    setStatus('paused');
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    accumulatedRef.current = 0;
    setElapsed(0);
    setStatus('idle');
    setSaved(false);
  };

  const handleSave = async () => {
    if (elapsed === 0) return;
    
    // Stop if running
    if (status === 'running') {
      clearInterval(intervalRef.current);
    }

    const now = new Date();
    const sessionData = {
      type: 'Stopwatch',
      duration: elapsed,
      startTime: new Date(now.getTime() - elapsed * 1000).toISOString(),
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

    // Reset everything
    accumulatedRef.current = 0;
    setElapsed(0);
    setStatus('idle');
    setSaved(true);
    triggerToast('Session saved');
  };

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(false), 2800);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (elapsedRef.current > 0 && !savedRef.current && statusRef.current !== 'idle') {
        const now = new Date();
        const sessionData = {
          type: 'Stopwatch',
          duration: elapsedRef.current,
          startTime: new Date(now.getTime() - elapsedRef.current * 1000).toISOString(),
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
      // Auto-save on unmount (navigation)
      if (elapsedRef.current > 0 && !savedRef.current && statusRef.current !== 'idle') {
        const now = new Date();
        const sessionData = {
          type: 'Stopwatch',
          duration: elapsedRef.current,
          startTime: new Date(now.getTime() - elapsedRef.current * 1000).toISOString(),
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

  const statusLabel = status === 'idle' ? 'Ready' : status === 'running' ? 'Running' : 'Paused';
  const statusClass = status === 'idle' ? 'status-idle' : status === 'running' ? 'status-running' : 'status-paused';

  return (
    <Flashcard onBack={async () => {
      if (elapsed > 0 && !saved) await handleSave();
      navigate('/select');
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <StopwatchIcon size={22} color="var(--text-medium)" />
          <h2 className="heading" style={{ margin: 0 }}>Stopwatch</h2>
        </div>
        <p className="subtext" style={{ marginBottom: '16px' }}>Track your study session</p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <span className={`status-badge ${statusClass}`}>
            {status === 'running' && <span className="pulse-dot" />}
            {statusLabel}
          </span>
        </div>

        <div className="digital-time digital-time-large" style={{ margin: '8px 0' }}>
          {formatTime(elapsed)}
        </div>

        {elapsed > 0 && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '16px' }}>
            {Math.floor(elapsed / 60)} min {elapsed % 60} sec elapsed
          </p>
        )}

        <div className="btn-row">
          {status === 'idle' && (
            <button className="btn-success" onClick={handleStart}>
              <PlayIcon size={15} color="white" /> Start
            </button>
          )}
          {status === 'running' && (
            <button className="btn-danger" onClick={handleStop}>
              <PauseIcon size={15} color="white" /> Pause
            </button>
          )}
          {status === 'paused' && (
            <>
              <button className="btn-success" onClick={handleStart}>
                <PlayIcon size={15} color="white" /> Resume
              </button>
              <button className="btn-danger" onClick={handleReset}>
                <ResetIcon size={15} color="white" /> Reset
              </button>
            </>
          )}
        </div>

        {elapsed > 0 && !saved && (
          <div style={{ marginTop: '16px' }}>
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
