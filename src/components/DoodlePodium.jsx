import React from 'react';

function formatTime(seconds) {
  const s = Number(seconds) || 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

// Minimal sophisticated sparkling star
function ElegantStar({ cx, cy, color, size = 1 }) {
  const s = size * 22;
  const path = `M ${cx},${cy - s} Q ${cx},${cy} ${cx + s},${cy} Q ${cx},${cy} ${cx},${cy + s} Q ${cx},${cy} ${cx - s},${cy} Q ${cx},${cy} ${cx},${cy - s} Z`;
  
  const s2 = size * 32; // larger glow shape
  const glowPath = `M ${cx},${cy - s2} Q ${cx},${cy} ${cx + s2},${cy} Q ${cx},${cy} ${cx},${cy + s2} Q ${cx},${cy} ${cx - s2},${cy} Q ${cx},${cy} ${cx},${cy - s2} Z`;

  return (
    <g>
      {/* Outer blurred glow */}
      <path d={glowPath} fill={color} fillOpacity="0.2" style={{ filter: `drop-shadow(0 0 10px ${color}90)` }} />
      {/* Core star */}
      <path d={path} fill={color} />
      {/* Bright center */}
      <circle cx={cx} cy={cy} r={size * 3.5} fill="#ffffff" fillOpacity="0.95" />
      
      {/* Little additional sparkles for 1st place only */}
      {size > 1 && (
        <>
          <path d={`M ${cx - 24},${cy - 20} q 6,6 12,0 q -6,-6 -12,0 Z`} fill={color} fillOpacity="0.6" transform={`rotate(45 ${cx-18} ${cy-20})`} />
          <path d={`M ${cx + 24},${cy + 16} q 4,4 8,0 q -4,-4 -8,0 Z`} fill={color} fillOpacity="0.6" transform={`rotate(45 ${cx+28} ${cy+16})`} />
        </>
      )}
    </g>
  );
}

export default function DoodlePodium({ top3 = [] }) {
  const [first, second, third] = top3;

  const GRAD_1 = 'url(#grad-first)';
  const GRAD_2 = 'url(#grad-second)';
  const GRAD_3 = 'url(#grad-third)';

  const COLOR_1 = '#cca0e8'; // Match stick figure to the purple part of the big box
  const COLOR_2 = '#f5cda0'; // Match stick figure to the peach part of the small box
  const COLOR_3 = '#9ccbed'; // Blue

  const GROUND = 250;
  const BLOCK = {
    first:  { x: 155, w: 130, h: 100, fill: GRAD_1, stroke: COLOR_1 },
    second: { x:  35, w: 110, h:  75, fill: GRAD_2, stroke: COLOR_2 },
    third:  { x: 295, w: 110, h:  55, fill: GRAD_3, stroke: COLOR_3 },
  };

  const starCY = {
    first:  GROUND - BLOCK.first.h  - 36,
    second: GROUND - BLOCK.second.h - 28,
    third:  GROUND - BLOCK.third.h  - 28,
  };
  const charCX = {
    first:  BLOCK.first.x  + BLOCK.first.w  / 2,
    second: BLOCK.second.x + BLOCK.second.w / 2,
    third:  BLOCK.third.x  + BLOCK.third.w  / 2,
  };

  const PodiumBlock = ({ block, label }) => (
    <g>
      <rect 
        x={block.x} y={GROUND - block.h} 
        width={block.w} height={block.h} 
        rx="12" fill={block.fill}
      />
      <text 
        x={block.x + block.w / 2} y={GROUND - 16}
        textAnchor="middle" fill="#ffffff" fillOpacity="0.95"
        fontFamily="Share Tech Mono, monospace" fontSize="36" fontWeight="bold"
      >
        {label}
      </text>
    </g>
  );

  return (
    <div style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
      <svg viewBox="0 0 440 280" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}>
        
        <defs>
          <linearGradient id="grad-first" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c5a9ee" />
            <stop offset="100%" stopColor="#9ccbed" />
          </linearGradient>
          <linearGradient id="grad-second" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7ba9c" />
            <stop offset="100%" stopColor="#c5a9ee" />
          </linearGradient>
          <linearGradient id="grad-third" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a4e4d6" />
            <stop offset="100%" stopColor="#9ccbed" />
          </linearGradient>
        </defs>

        {/* Subtle ground dashed line */}
        <line x1="20" y1={GROUND} x2="420" y2={GROUND}
          stroke="var(--text-medium)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="8 6" />

        {/* Podium Blocks */}
        <PodiumBlock block={BLOCK.second} label="2" />
        <PodiumBlock block={BLOCK.third} label="3" />
        <PodiumBlock block={BLOCK.first} label="1" />

        {/* Sophisticated Stars */}
        {second && <ElegantStar cx={charCX.second} cy={starCY.second} color={BLOCK.second.stroke} size={0.8} />}
        {third  && <ElegantStar cx={charCX.third}  cy={starCY.third}  color={BLOCK.third.stroke} size={0.7} />}
        {first  && <ElegantStar cx={charCX.first}  cy={starCY.first}  color={BLOCK.first.stroke} size={1.2} />}
      </svg>

      {/* Name + time labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '12px', padding: '0 8px' }}>
        <div style={{ width: '28%', textAlign: 'center' }}>
          {second ? <>
            <div style={{ fontSize: '0.90rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {second.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.78rem', color: BLOCK.second.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(second.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>

        <div style={{ width: '36%', textAlign: 'center' }}>
          {first ? <>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {first.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.86rem', color: BLOCK.first.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(first.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>

        <div style={{ width: '28%', textAlign: 'center' }}>
          {third ? <>
            <div style={{ fontSize: '0.90rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {third.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.78rem', color: BLOCK.third.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(third.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>
      </div>
    </div>
  );
}
