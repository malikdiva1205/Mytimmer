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

// Minimal outline stick figure matching the sophisticated image
function OutlineChar({ cx, topY, color, pose = 'second' }) {
  const headR = 12;
  const hcy = topY + headR;
  const neckY = hcy + headR;
  const bcy = neckY + 24; // length of body line

  const isWinner = pose === 'winner';

  // Arm positions
  const arms = {
    winner: `M ${cx},${neckY + 6} L ${cx - 24},${neckY - 14} M ${cx},${neckY + 6} L ${cx + 24},${neckY - 14}`,
    second: `M ${cx},${neckY + 6} L ${cx - 20},${neckY - 8} M ${cx},${neckY + 6} L ${cx + 20},${neckY + 8}`,
    third:  `M ${cx},${neckY + 6} L ${cx - 20},${neckY + 8} M ${cx},${neckY + 6} L ${cx + 20},${neckY - 8}`,
  };

  // Leg positions
  const legBot = bcy + 22;
  const legs = `M ${cx - 12},${legBot} L ${cx},${bcy} L ${cx + 12},${legBot}`;

  return (
    <g stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Head */}
      <circle cx={cx} cy={hcy} r={headR} />
      
      {/* Eyes and Mouth (very minimal) */}
      <circle cx={cx - 4} cy={hcy - 2} r="1" fill={color} stroke="none" />
      <circle cx={cx + 4} cy={hcy - 2} r="1" fill={color} stroke="none" />
      <path d={`M ${cx - 3},${hcy + 4} Q ${cx},${hcy + 7} ${cx + 3},${hcy + 4}`} strokeWidth="1.5" />

      {/* Body */}
      <line x1={cx} y1={neckY} x2={cx} y2={bcy} />

      {/* Arms & Legs */}
      <path d={arms[pose]} />
      <path d={legs} />

      {/* Chest Medal */}
      <circle cx={cx} cy={neckY + 12} r="5" fill={color} fillOpacity="0.2" />

      {/* Winner Stars on hands */}
      {isWinner && (
        <>
          <path d={`M ${cx - 24},${neckY - 24} l 2,6 l 6,2 l -6,2 l -2,6 l -2,-6 l -6,-2 l 6,-2 Z`} fill={color} stroke="none" />
          <path d={`M ${cx + 24},${neckY - 24} l 2,6 l 6,2 l -6,2 l -2,6 l -2,-6 l -6,-2 l 6,-2 Z`} fill={color} stroke="none" />
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

  const CHAR_H = 70; // approx height of the stick figure
  const PAD = 4;

  const topY = {
    first:  GROUND - BLOCK.first.h  - CHAR_H + PAD,
    second: GROUND - BLOCK.second.h - CHAR_H + PAD,
    third:  GROUND - BLOCK.third.h  - CHAR_H + PAD,
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

        {/* Outline Stick Figures */}
        {second && <OutlineChar cx={charCX.second} topY={topY.second} color={BLOCK.second.stroke} pose="second" />}
        {third  && <OutlineChar cx={charCX.third}  topY={topY.third}  color={BLOCK.third.stroke} pose="third"  />}
        {first  && <OutlineChar cx={charCX.first}  topY={topY.first}  color={BLOCK.first.stroke} pose="winner" />}
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
