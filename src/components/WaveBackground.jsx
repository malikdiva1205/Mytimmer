import React from 'react';

// Soft gradient wave background with SVG waves - inspired by pastel gradient design
export default function WaveBackground() {
  return (
    <>
      <div className="wave-bg">
        {/* Top wave */}
        <svg className="wave-svg-top" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '260px' }}>
          <path
            fill="var(--wave-1)"
            d="M0,160 C200,240 400,80 600,160 C800,240 1000,80 1200,160 C1320,200 1380,180 1440,160 L1440,0 L0,0 Z"
            style={{ transition: 'fill var(--transition)' }}
          />
          <path
            fill="var(--wave-2)"
            d="M0,100 C180,180 360,40 540,120 C720,200 900,60 1080,140 C1200,190 1340,150 1440,130 L1440,0 L0,0 Z"
            style={{ transition: 'fill var(--transition)' }}
          />
          <path
            fill="var(--wave-3)"
            d="M0,60 C220,120 440,20 660,80 C880,140 1060,30 1280,90 L1440,70 L1440,0 L0,0 Z"
            style={{ transition: 'fill var(--transition)' }}
          />
        </svg>

        {/* Bottom wave */}
        <svg className="wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '240px' }}>
          <path
            fill="var(--wave-4)"
            d="M0,160 C240,80 480,240 720,160 C960,80 1200,200 1440,160 L1440,320 L0,320 Z"
            style={{ transition: 'fill var(--transition)' }}
          />
          <path
            fill="var(--wave-5)"
            d="M0,200 C200,120 400,260 640,200 C880,140 1080,240 1440,200 L1440,320 L0,320 Z"
            style={{ transition: 'fill var(--transition)' }}
          />
          <path
            fill="var(--wave-6)"
            d="M0,240 C300,180 600,280 900,240 C1100,210 1280,260 1440,240 L1440,320 L0,320 Z"
            style={{ transition: 'fill var(--transition)' }}
          />
        </svg>

        {/* Floating doodles */}
        <svg
          style={{ position: 'absolute', top: '8%', right: '5%', width: '140px', opacity: 0.12 }}
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="35" fill="none" stroke="var(--lavender)" strokeWidth="2" strokeDasharray="8 6" style={{ transition: 'stroke var(--transition)' }} />
          <circle cx="50" cy="50" r="20" fill="none" stroke="var(--soft-blue)" strokeWidth="1.5" style={{ transition: 'stroke var(--transition)' }} />
          <circle cx="50" cy="50" r="6" fill="var(--lavender)" style={{ transition: 'fill var(--transition)' }} />
        </svg>

        <svg
          style={{ position: 'absolute', bottom: '15%', left: '4%', width: '100px', opacity: 0.1 }}
          viewBox="0 0 100 100"
        >
          <polygon points="50,10 90,85 10,85" fill="none" stroke="var(--peach)" strokeWidth="2.5" strokeLinejoin="round" style={{ transition: 'stroke var(--transition)' }} />
          <polygon points="50,28 76,75 24,75" fill="none" stroke="var(--sage)" strokeWidth="1.5" strokeLinejoin="round" style={{ transition: 'stroke var(--transition)' }} />
        </svg>

        <svg
          style={{ position: 'absolute', top: '40%', left: '3%', width: '80px', opacity: 0.1 }}
          viewBox="0 0 80 80"
        >
          <path d="M40,5 C58,5 73,20 73,38 C73,56 58,71 40,71 C22,71 7,56 7,38 C7,20 22,5 40,5" fill="none" stroke="var(--lavender)" strokeWidth="2" strokeDasharray="5 4" style={{ transition: 'stroke var(--transition)' }} />
          <path d="M40,18 C51,18 62,26 62,38" fill="none" stroke="var(--soft-blue)" strokeWidth="1.5" style={{ transition: 'stroke var(--transition)' }} />
        </svg>

        <svg
          style={{ position: 'absolute', top: '25%', right: '8%', width: '60px', opacity: 0.1 }}
          viewBox="0 0 60 60"
        >
          <rect x="5" y="5" width="50" height="50" rx="8" fill="none" stroke="var(--peach)" strokeWidth="2" style={{ transition: 'stroke var(--transition)' }} />
          <rect x="15" y="15" width="30" height="30" rx="5" fill="none" stroke="var(--sage)" strokeWidth="1.5" style={{ transition: 'stroke var(--transition)' }} />
        </svg>

        <svg
          style={{ position: 'absolute', bottom: '28%', right: '3%', width: '70px', opacity: 0.09 }}
          viewBox="0 0 70 70"
        >
          <path d="M35,5 L42,25 L63,25 L47,38 L53,58 L35,45 L17,58 L23,38 L7,25 L28,25 Z"
            fill="none" stroke="var(--lavender)" strokeWidth="2" strokeLinejoin="round" style={{ transition: 'stroke var(--transition)' }} />
        </svg>
      </div>
    </>
  );
}
