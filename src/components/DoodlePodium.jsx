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

const starPath = (x, y, s) =>
  `M ${x},${y - s} L ${x + s * 0.22},${y - s * 0.22} L ${x + s},${y} L ${x + s * 0.22},${y + s * 0.22} L ${x},${y + s} L ${x - s * 0.22},${y + s * 0.22} L ${x - s},${y} L ${x - s * 0.22},${y - s * 0.22} Z`;

function DoodleChar({ cx, topY, fill, stroke, pose }) {
  const headR = 22;
  const bodyRx = 16;
  const bodyRy = 19;
  const hcy = topY + headR;
  const bcy = hcy + headR + bodyRy - 7;

  const aLx = cx - bodyRx;
  const aRx = cx + bodyRx;
  const aY  = bcy - bodyRy * 0.4;

  const arms = {
    winner: {
      L: `M ${aLx},${aY} Q ${cx - 36},${aY - 18} ${cx - 42},${hcy - 8}`,
      R: `M ${aRx},${aY} Q ${cx + 36},${aY - 18} ${cx + 42},${hcy - 8}`,
    },
    second: {
      L: `M ${aLx},${aY + 4} Q ${cx - 34},${aY + 12} ${cx - 40},${aY + 18}`,
      R: `M ${aRx},${aY - 2} Q ${cx + 31},${aY - 18} ${cx + 36},${hcy + 6}`,
    },
    third: {
      L: `M ${aLx},${aY + 4} Q ${cx - 34},${aY + 12} ${cx - 40},${aY + 18}`,
      R: `M ${aRx},${aY - 2} Q ${cx + 33},${aY - 20} ${cx + 37},${hcy - 2}`,
    },
  };

  const legBot = bcy + bodyRy + 16;
  const neckY  = hcy + headR - 2;
  const medalY = neckY + 16;
  const mouthY = hcy + 6;
  const isWinner = pose === 'winner';

  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* Arms */}
      <path d={arms[pose].L} fill="none" stroke={stroke} strokeWidth="3" />
      <path d={arms[pose].R} fill="none" stroke={stroke} strokeWidth="3" />

      {/* Body */}
      <ellipse cx={cx} cy={bcy} rx={bodyRx} ry={bodyRy} fill={fill} stroke={stroke} strokeWidth="2.5" />

      {/* Head */}
      <circle cx={cx} cy={hcy} r={headR} fill={fill} stroke={stroke} strokeWidth="2.5" />

      {/* Blush */}
      <circle cx={cx - 13} cy={hcy + 5} r="5" fill={stroke} fillOpacity="0.2" stroke="none" />
      <circle cx={cx + 13} cy={hcy + 5} r="5" fill={stroke} fillOpacity="0.2" stroke="none" />

      {/* Eyes */}
      <circle cx={cx - 7} cy={hcy - 4} r="2.8" fill={stroke} stroke="none" />
      <circle cx={cx + 7} cy={hcy - 4} r="2.8" fill={stroke} stroke="none" />
      <circle cx={cx - 5.5} cy={hcy - 5.5} r="1.1" fill="white" stroke="none" />
      <circle cx={cx + 8.5} cy={hcy - 5.5} r="1.1" fill="white" stroke="none" />

      {/* Mouth */}
      {isWinner ? (
        <path d={`M ${cx - 9},${mouthY} Q ${cx},${mouthY + 13} ${cx + 9},${mouthY} Z`}
          fill={stroke} stroke="none" />
      ) : (
        <path d={`M ${cx - 6},${mouthY} L ${cx},${mouthY + 9} L ${cx + 6},${mouthY}`}
          fill="none" stroke={stroke} strokeWidth="2.2" />
      )}

      {/* Medal lanyard */}
      <path d={`M ${cx - 5},${neckY} L ${cx},${medalY} M ${cx + 5},${neckY} L ${cx},${medalY}`}
        fill="none" stroke={stroke} strokeWidth="2" />
      {/* Medal disk */}
      <circle cx={cx} cy={medalY + 7} r="7.5" fill={fill} stroke={stroke} strokeWidth="2.2" />
      <circle cx={cx} cy={medalY + 7} r="4"   fill={stroke} fillOpacity="0.3" stroke="none" />

      {/* Legs */}
      <path d={`M ${cx - 6},${bcy + bodyRy - 2} L ${cx - 9},${legBot}`}
        fill="none" stroke={stroke} strokeWidth="3" />
      <path d={`M ${cx + 6},${bcy + bodyRy - 2} L ${cx + 9},${legBot}`}
        fill="none" stroke={stroke} strokeWidth="3" />

      {/* Winner sparkles */}
      {isWinner && <>
        <path d={starPath(cx + 31, hcy - 24, 8)} fill={stroke} fillOpacity="0.65" stroke="none" />
        <path d={starPath(cx - 28, hcy - 17, 5.5)} fill={stroke} fillOpacity="0.45" stroke="none" />
      </>}
    </g>
  );
}

export default function DoodlePodium({ top3 = [] }) {
  const [first, second, third] = top3;

  // Teal-navy palette from user swatch
  const LAV   = { fill: '#b0ecea', stroke: '#16aaa4' }; // teal (1st)
  const PEACH = { fill: '#c8f2ef', stroke: '#50c8c2' }; // light mint (2nd)
  const MINT  = { fill: '#c4ccf4', stroke: '#1c38c8' }; // deep navy (3rd)

  const GROUND = 268;
  const BLOCK = {
    first:  { x: 152, w: 132, h: 112, c: LAV   },
    second: { x:  36, w: 112, h:  80, c: PEACH  },
    third:  { x: 292, w: 112, h:  60, c: MINT   },
  };

  // char height ≈ headR + (headR+bodyRy-7) + bodyRy + 16 = 22+35+19+16 = 92
  const CHAR_H = 92;
  const PAD    = 6; // legs overlap into block

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

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <svg viewBox="0 0 440 298" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}>

        {/* 2nd – peach */}
        <rect x={BLOCK.second.x} y={GROUND - BLOCK.second.h}
          width={BLOCK.second.w} height={BLOCK.second.h} rx="12"
          fill="rgba(80,200,194,0.12)" stroke={PEACH.stroke} strokeWidth="2.2" />
        <text x={BLOCK.second.x + BLOCK.second.w / 2} y={GROUND - 9}
          textAnchor="middle" fill={PEACH.stroke}
          fontFamily="Sofia, cursive" fontSize="26" fontWeight="bold">2</text>

        {/* 1st – lavender */}
        <rect x={BLOCK.first.x} y={GROUND - BLOCK.first.h}
          width={BLOCK.first.w} height={BLOCK.first.h} rx="12"
          fill="rgba(22,170,164,0.12)" stroke={LAV.stroke} strokeWidth="2.2" />
        <text x={BLOCK.first.x + BLOCK.first.w / 2} y={GROUND - 9}
          textAnchor="middle" fill={LAV.stroke}
          fontFamily="Sofia, cursive" fontSize="26" fontWeight="bold">1</text>

        {/* 3rd – mint */}
        <rect x={BLOCK.third.x} y={GROUND - BLOCK.third.h}
          width={BLOCK.third.w} height={BLOCK.third.h} rx="12"
          fill="rgba(28,56,200,0.10)" stroke={MINT.stroke} strokeWidth="2.2" />
        <text x={BLOCK.third.x + BLOCK.third.w / 2} y={GROUND - 9}
          textAnchor="middle" fill={MINT.stroke}
          fontFamily="Sofia, cursive" fontSize="26" fontWeight="bold">3</text>

        {/* Ground line */}
        <line x1="14" y1={GROUND} x2="426" y2={GROUND}
          stroke="rgba(197,184,232,0.45)" strokeWidth="2" strokeDasharray="6 4" />

        {/* Characters — draw second & third first so winner is on top */}
        {second && <DoodleChar cx={charCX.second} topY={topY.second} fill={PEACH.fill} stroke={PEACH.stroke} pose="second" />}
        {third  && <DoodleChar cx={charCX.third}  topY={topY.third}  fill={MINT.fill}  stroke={MINT.stroke}  pose="third"  />}
        {first  && <DoodleChar cx={charCX.first}  topY={topY.first}  fill={LAV.fill}   stroke={LAV.stroke}   pose="winner" />}
      </svg>

      {/* Name + time labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '-2px', padding: '0 4px' }}>
        <div style={{ width: '28%', textAlign: 'center' }}>
          {second ? <>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {second.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.76rem', color: PEACH.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(second.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>

        <div style={{ width: '36%', textAlign: 'center' }}>
          {first ? <>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {first.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.84rem', color: LAV.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(first.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>

        <div style={{ width: '28%', textAlign: 'center' }}>
          {third ? <>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {third.name.split(' ')[0]}
            </div>
            <div style={{ fontSize: '0.76rem', color: MINT.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
              {formatTime(third.total_time)}
            </div>
          </> : <div style={{ height: 36 }} />}
        </div>
      </div>
    </div>
  );
}
