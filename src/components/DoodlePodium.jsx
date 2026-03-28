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

// A single doodle stickfigure character
// pose: 'winner' | 'second' | 'third'
function StickFigure({ cx, cy, color = '#3d3452', pose = 'second', medalColor }) {
  const headR = 13;

  // Pose-specific limb paths
  const poses = {
    winner: {
      // Both arms raised high
      leftArm:  `M ${cx - 8},${cy + 10} Q ${cx - 30},${cy - 10} ${cx - 38},${cy - 24}`,
      rightArm: `M ${cx + 8},${cy + 10} Q ${cx + 30},${cy - 10} ${cx + 38},${cy - 24}`,
      leftLeg:  `M ${cx},${cy + 42} L ${cx - 14},${cy + 72}`,
      rightLeg: `M ${cx},${cy + 42} L ${cx + 14},${cy + 72}`,
      // Big happy open smile
      mouth: `M ${cx - 8},${cy - headR + 8} Q ${cx},${cy - headR + 18} ${cx + 8},${cy - headR + 8}`,
      mouthFill: true,
    },
    second: {
      // One arm confident/side, one slightly raised
      leftArm:  `M ${cx - 8},${cy + 10} Q ${cx - 30},${cy + 4}  ${cx - 36},${cy - 8}`,
      rightArm: `M ${cx + 8},${cy + 10} Q ${cx + 28},${cy + 14} ${cx + 34},${cy + 10}`,
      leftLeg:  `M ${cx},${cy + 42} L ${cx - 12},${cy + 72}`,
      rightLeg: `M ${cx},${cy + 42} L ${cx + 12},${cy + 72}`,
      mouth: `M ${cx - 7},${cy - headR + 9} Q ${cx},${cy - headR + 17} ${cx + 7},${cy - headR + 9}`,
      mouthFill: false,
    },
    third: {
      // One arm raised, one lower
      leftArm:  `M ${cx - 8},${cy + 10} Q ${cx - 28},${cy + 12} ${cx - 34},${cy + 8}`,
      rightArm: `M ${cx + 8},${cy + 10} Q ${cx + 30},${cy - 8}  ${cx + 36},${cy - 18}`,
      leftLeg:  `M ${cx},${cy + 42} L ${cx - 12},${cy + 72}`,
      rightLeg: `M ${cx},${cy + 42} L ${cx + 12},${cy + 72}`,
      mouth: `M ${cx - 7},${cy - headR + 9} Q ${cx},${cy - headR + 16} ${cx + 7},${cy - headR + 9}`,
      mouthFill: false,
    },
  };

  const p = poses[pose];

  return (
    <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* Head */}
      <circle cx={cx} cy={cy - headR - 12} r={headR} />

      {/* Eyes */}
      <circle cx={cx - 4} cy={cy - headR - 14} r="2" fill={color} stroke="none" />
      <circle cx={cx + 4} cy={cy - headR - 14} r="2" fill={color} stroke="none" />

      {/* Mouth */}
      {p.mouthFill ? (
        <path d={p.mouth} fill={color} stroke="none" />
      ) : (
        <path d={p.mouth} strokeWidth="2.5" />
      )}

      {/* Body */}
      <line x1={cx} y1={cy - 2} x2={cx} y2={cy + 42} />

      {/* Arms */}
      <path d={p.leftArm} strokeWidth="3" />
      <path d={p.rightArm} strokeWidth="3" />

      {/* Legs */}
      <path d={p.leftLeg} />
      <path d={p.rightLeg} />

      {/* Medal ribbon */}
      <line x1={cx} y1={cy + 6} x2={cx} y2={cy + 20} strokeWidth="2.5" stroke={medalColor} />
      {/* Medal disk */}
      <circle cx={cx} cy={cy + 26} r="8" fill={medalColor} fillOpacity="0.25" stroke={medalColor} strokeWidth="2.5" />
      {/* Sparkle (winner only) */}
      {pose === 'winner' && (
        <>
          <path d={`M ${cx - 48},${cy - 50} l 4,-10 l 4,10 l 10,4 l -10,4 l -4,10 l -4,-10 l -10,-4 Z`} stroke={medalColor} strokeWidth="1.5" fill={medalColor} fillOpacity="0.4" />
          <path d={`M ${cx + 42},${cy - 42} l 3,-8 l 3,8 l 8,3 l -8,3 l -3,8 l -3,-8 l -8,-3 Z`} stroke={medalColor} strokeWidth="1.5" fill={medalColor} fillOpacity="0.4" />
        </>
      )}
    </g>
  );
}

export default function DoodlePodium({ top3 = [] }) {
  const [first, second, third] = top3;

  const GOLD   = '#c9a800';
  const SILVER = '#8a8a9a';
  const BRONZE = '#a0632a';

  // Podium block config: [x_left, y_top, width, height, label]
  // The SVG is 440 wide, 320 tall. Ground line at y=270.
  const GROUND = 270;
  const BLOCK = {
    first:  { x: 155, w: 130, h: 110, label: '1' },  // tallest center
    second: { x: 40,  w: 110, h:  80, label: '2' },  // left
    third:  { x: 290, w: 110, h:  60, label: '3' },  // right
  };

  // Character center-X = block.x + block.w/2
  // Character base-Y = GROUND - block.h   (bottom of body aligned with top of block)
  const char = {
    first:  { cx: BLOCK.first.x  + BLOCK.first.w  / 2, cy: GROUND - BLOCK.first.h  - 70 },
    second: { cx: BLOCK.second.x + BLOCK.second.w / 2, cy: GROUND - BLOCK.second.h - 70 },
    third:  { cx: BLOCK.third.x  + BLOCK.third.w  / 2, cy: GROUND - BLOCK.third.h  - 70 },
  };

  return (
    <div style={{ width: '100%', maxWidth: 460, margin: '0 auto' }}>
      <svg
        viewBox="0 0 440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* ── Podium blocks ── */}
        {/* 2nd place block */}
        <rect
          x={BLOCK.second.x} y={GROUND - BLOCK.second.h}
          width={BLOCK.second.w} height={BLOCK.second.h}
          rx="6" ry="6"
          fill="rgba(192,192,192,0.18)" stroke={SILVER} strokeWidth="2.5"
        />
        <text
          x={BLOCK.second.x + BLOCK.second.w / 2} y={GROUND - 14}
          textAnchor="middle" fill={SILVER}
          fontFamily="Share Tech Mono, monospace" fontSize="28" fontWeight="bold"
        >2</text>

        {/* 1st place block */}
        <rect
          x={BLOCK.first.x} y={GROUND - BLOCK.first.h}
          width={BLOCK.first.w} height={BLOCK.first.h}
          rx="6" ry="6"
          fill="rgba(255,215,0,0.15)" stroke={GOLD} strokeWidth="2.5"
        />
        <text
          x={BLOCK.first.x + BLOCK.first.w / 2} y={GROUND - 14}
          textAnchor="middle" fill={GOLD}
          fontFamily="Share Tech Mono, monospace" fontSize="28" fontWeight="bold"
        >1</text>

        {/* 3rd place block */}
        <rect
          x={BLOCK.third.x} y={GROUND - BLOCK.third.h}
          width={BLOCK.third.w} height={BLOCK.third.h}
          rx="6" ry="6"
          fill="rgba(205,127,50,0.15)" stroke={BRONZE} strokeWidth="2.5"
        />
        <text
          x={BLOCK.third.x + BLOCK.third.w / 2} y={GROUND - 14}
          textAnchor="middle" fill={BRONZE}
          fontFamily="Share Tech Mono, monospace" fontSize="28" fontWeight="bold"
        >3</text>

        {/* ── Ground line ── */}
        <line x1="20" y1={GROUND} x2="420" y2={GROUND} stroke="rgba(100,80,140,0.3)" strokeWidth="2" strokeDasharray="6 4" />

        {/* ── Stick figures ── */}
        {second && <StickFigure cx={char.second.cx} cy={char.second.cy} pose="second" medalColor={SILVER} />}
        {first  && <StickFigure cx={char.first.cx}  cy={char.first.cy}  pose="winner" medalColor={GOLD} />}
        {third  && <StickFigure cx={char.third.cx}  cy={char.third.cy}  pose="third"  medalColor={BRONZE} />}
      </svg>

      {/* ── Name + time labels beneath each block ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '-4px', padding: '0 8px' }}>

        {/* 2nd */}
        <div style={{ width: '28%', textAlign: 'center' }}>
          {second ? (
            <>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {second.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.78rem', color: SILVER, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
                {formatTime(second.total_time)}
              </div>
            </>
          ) : <div style={{ height: 36 }} />}
        </div>

        {/* 1st */}
        <div style={{ width: '36%', textAlign: 'center' }}>
          {first ? (
            <>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {first.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.85rem', color: GOLD, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
                {formatTime(first.total_time)}
              </div>
            </>
          ) : <div style={{ height: 36 }} />}
        </div>

        {/* 3rd */}
        <div style={{ width: '28%', textAlign: 'center' }}>
          {third ? (
            <>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {third.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.78rem', color: BRONZE, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
                {formatTime(third.total_time)}
              </div>
            </>
          ) : <div style={{ height: 36 }} />}
        </div>
      </div>
    </div>
  );
}
