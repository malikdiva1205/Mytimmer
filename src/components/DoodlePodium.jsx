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

// Cluster of hand-drawn sparkles (4-pointed) matching the user reference
function HandDrawnStar({ cx, cy, fill, size = 1 }) {
  const Sparkle = ({ dx, dy, s }) => {
    const x = cx + dx * size;
    const y = cy + dy * size;
    const h = 20 * s * size; // Vertical stretch
    const w = 12 * s * size; // Horizontal width
    const d = `M ${x},${y - h} Q ${x},${y} ${x + w},${y} Q ${x},${y} ${x},${y + h} Q ${x},${y} ${x - w},${y} Q ${x},${y} ${x},${y - h} Z`;
    return <path d={d} fill={fill} stroke="#2d3748" strokeWidth="3" strokeLinejoin="round" />;
  };

  const Plus = ({ dx, dy, s }) => {
    const x = cx + dx * size;
    const y = cy + dy * size;
    const len = 5 * s * size;
    return (
      <g stroke="#2d3748" strokeWidth="3" strokeLinecap="round">
        <line x1={x} y1={y - len} x2={x} y2={y + len} />
        <line x1={x - len} y1={y} x2={x + len} y2={y} />
      </g>
    );
  };

  return (
    <g>
      {/* Top Left large sparkle */}
      <Sparkle dx={-12} dy={-15} s={1.1} />
      {/* Bottom Right medium sparkle */}
      <Sparkle dx={18} dy={12} s={0.8} />
      {/* Bottom tiny sparkle */}
      <Sparkle dx={-2} dy={36} s={0.4} />
      {/* Decorator plus signs */}
      <Plus dx={25} dy={-25} s={1} />
      <Plus dx={-25} dy={22} s={1.2} />
    </g>
  );
}

const DoodleBox = ({ x, y, w, h, fill, number, rank }) => {
  const p1 = `M ${x+2},${y+4} Q ${x+w/2},${y-3} ${x+w-2},${y+2} Q ${x+w+3},${y+h/2} ${x+w-1},${y+h-1} Q ${x+w/2},${y+h+2} ${x+2},${y+h-2} Q ${x-2},${y+h/2} ${x+2},${y+4} Z`;
  const p2 = `M ${x-1},${y+1} Q ${x+w/2},${y+5} ${x+w+1},${y-1} Q ${x+w-3},${y+h/2} ${x+w+2},${y+h+1} Q ${x+w/2},${y+h-1} ${x-1},${y+h+1} Q ${x+3},${y+h/2} ${x-1},${y+1} Z`;
  const topFace = `M ${x+8},${y+14} Q ${x+w/2},${y+10} ${x+w-10},${y+12}`;

  return (
    <g>
      {/* Box shadow beneath for extra sketchy depth */}
      <path d={p1} fill="none" stroke="#cbd5e1" strokeWidth="6" transform="translate(0, 4)" opacity="0.4" />
      
      <path d={p1} fill={fill} stroke="#2d3748" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={p2} fill="none" stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d={topFace} fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      
      {/* Hatching for depth */}
      {rank === 2 && (
        <g stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          <line x1={x+w-14} y1={y+40} x2={x+w-6} y2={y+32} />
          <line x1={x+w-16} y1={y+55} x2={x+w-6} y2={y+45} />
          <line x1={x+w-18} y1={y+70} x2={x+w-6} y2={y+58} />
          <line x1={x+w-17} y1={y+85} x2={x+w-8} y2={y+76} />
        </g>
      )}
      {rank === 3 && (
        <g stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          <line x1={x+6} y1={y+20} x2={x+14} y2={y+28} />
          <line x1={x+7} y1={y+35} x2={x+16} y2={y+44} />
          <line x1={x+5} y1={y+50} x2={x+14} y2={y+59} />
          <line x1={x+8} y1={y+65} x2={x+16} y2={y+73} />
        </g>
      )}

      {/* Number with hand-drawn font styling */}
      <text 
        x={x + w / 2} y={y + h / 2 + 20} 
        textAnchor="middle" fill="#2d3748"
        fontFamily="Nunito, sans-serif" fontSize="72" fontWeight="900"
      >
        {number}
      </text>
      <text 
        x={x + w / 2 - 2} y={y + h / 2 + 18} 
        textAnchor="middle" fill="none" stroke="#2d3748" strokeWidth="1"
        fontFamily="Nunito, sans-serif" fontSize="72" fontWeight="900"
        opacity="0.4"
      >
        {number}
      </text>
    </g>
  );
};

const GroundScribbles = () => (
  <g stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" opacity="0.3">
    {/* Left scribbles */}
    <path d="M 10,278 L 30,274 M 25,282 L 45,278 M 15,285 L 35,282" />
    <path d="M 40,277 Q 60,273 80,278 Q 100,274 120,279" fill="none" />
    {/* Center scribbles */}
    <path d="M 130,283 Q 160,277 190,282 Q 220,275 250,281 M 150,286 L 180,281 M 210,287 L 240,282" fill="none" />
    {/* Right scribbles */}
    <path d="M 260,279 Q 290,274 320,278 Q 350,273 380,279 M 290,284 L 320,279 M 350,285 L 380,280" fill="none" />
    <path d="M 390,278 L 410,274 M 400,282 L 420,278 M 395,285 L 415,282" />
  </g>
);

export default function DoodlePodium({ top3 = [] }) {
  const [first, second, third] = top3;

  // Extremely light pastel fills for the doodle canvas
  const FILL_1 = '#f4effc'; // Lavender
  const FILL_2 = '#fdf4eb'; // Peach
  const FILL_3 = '#eef7fb'; // Blue

  const GROUND = 275;

  return (
    <div style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
      <svg viewBox="0 0 440 300" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}>
        
        <GroundScribbles />

        {/* Podium Blocks (Rendered back-to-front to support overlapping!) */}
        {/* Left Side: 2nd Place */}
        <DoodleBox x={20} y={GROUND - 110} w={130} h={110} fill={FILL_2} number="2" rank={2} />
        
        {/* Right Side: 3rd Place */}
        <DoodleBox x={290} y={GROUND - 85} w={130} h={85} fill={FILL_3} number="3" rank={3} />
        
        {/* Center: 1st Place (overlaps the side boxes) */}
        <DoodleBox x={135} y={GROUND - 150} w={170} h={150} fill={FILL_1} number="1" rank={1} />

        {/* Floating Stars */}
        {second && <HandDrawnStar cx={85} cy={GROUND - 135} fill={FILL_2} size={0.9} />}
        {third  && <HandDrawnStar cx={355} cy={GROUND - 110} fill={FILL_3} size={0.8} />}
        {first  && <HandDrawnStar cx={220} cy={GROUND - 180} fill={FILL_1} size={1.3} />}
      </svg>

      {/* Name + time labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '12px', padding: '0 8px' }}>
        <div style={{ width: '28%', textAlign: 'center' }}>
          {second ? <>
            <div style={{ fontSize: '0.90rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {second.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#d4895a', fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(second.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>

        <div style={{ width: '36%', textAlign: 'center' }}>
          {first ? <>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {first.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.86rem', color: '#9180c8', fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(first.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>

        <div style={{ width: '28%', textAlign: 'center' }}>
          {third ? <>
            <div style={{ fontSize: '0.90rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {third.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5faa86', fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(third.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>
      </div>
    </div>
  );
}
