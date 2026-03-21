import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WaveBackground from './components/WaveBackground';
import LandingPage from './pages/LandingPage';
import ModeSelectPage from './pages/ModeSelectPage';
import ClockPage from './pages/ClockPage';
import StopwatchPage from './pages/StopwatchPage';
import PomodoroPage from './pages/PomodoroPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import StudyPartner from './components/StudyPartner';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemeToggle />
        <StudyPartner />
        <WaveBackground />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/select" element={<ModeSelectPage />} />
            <Route path="/clock" element={<ClockPage />} />
            <Route path="/stopwatch" element={<StopwatchPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
