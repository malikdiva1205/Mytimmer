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

// Cute blob character — snowman-style (big round head + small round body + arm & feet bumps)
function BlobChar({ cx, topY, fill, stroke, pose = 'second' }) {
  const headR = 17;
  const bodyR = 13;
  const hcy = topY + headR;                       // head center y
  const bcy = hcy + headR + bodyR - 4;            // body center y (slight overlap)

  // Arm ellipse centres (beside the body)
  const lax = cx - bodyR - 8;
  const rax = cx + bodyR + 8;
  const aY  = bcy - bodyR * 0.25;

  // Arm tilt angles per pose
  const tiltL = { winner: -60, second: -28, third: -20 };
  const tiltR = { winner:  60, second:  18, third:  48 };

  // Mouth width / drop
  const mW   = pose === 'winner' ? 9  : 6;
  const mDrop = pose === 'winner' ? 8  : 4;
  const mY   = hcy + 5;

  // Feet ellipse centres
  const lfx = cx - 7;
  const rfx = cx + 7;
  const fy  = bcy + bodyR + 6;

  return (
    <g>
      {/* ── Arms ── */}
      <ellipse cx={lax} cy={aY} rx={9} ry={5}
        fill={fill} stroke={stroke} strokeWidth="1.8"
        transform={`rotate(${tiltL[pose]},${lax},${aY})`} />
      <ellipse cx={rax} cy={aY} rx={9} ry={5}
        fill={fill} stroke={stroke} strokeWidth="1.8"
        transform={`rotate(${tiltR[pose]},${rax},${aY})`} />

      {/* ── Body ── */}
      <circle cx={cx} cy={bcy} r={bodyR} fill={fill} stroke={stroke} strokeWidth="2" />

      {/* ── Head ── */}
      <circle cx={cx} cy={hcy} r={headR} fill={fill} stroke={stroke} strokeWidth="2" />

      {/* ── Eyes ── */}
      <circle cx={cx - 5} cy={hcy - 4} r="2.5" fill={stroke} />
      <circle cx={cx + 5} cy={hcy - 4} r="2.5" fill={stroke} />
      {/* eye shine */}
      <circle cx={cx - 3.8} cy={hcy - 5.5} r="1" fill="rgba(255,255,255,0.85)" />
      <circle cx={cx + 6.2} cy={hcy - 5.5} r="1" fill="rgba(255,255,255,0.85)" />

      {/* ── Mouth ── */}
      <path
        d={`M ${cx - mW} ${mY} Q ${cx} ${mY + mDrop} ${cx + mW} ${mY}`}
        fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"
      />

      {/* ── Feet ── */}
      <ellipse cx={lfx} cy={fy} rx={5.5} ry={4} fill={fill} stroke={stroke} strokeWidth="1.8" />
      <ellipse cx={rfx} cy={fy} rx={5.5} ry={4} fill={fill} stroke={stroke} strokeWidth="1.8" />

      {/* ── Winner sparkles ── */}
      {pose === 'winner' && (
        <>
          <path
            d={`M ${cx+26} ${hcy-24} l 3.8,-8.5 l 3.8,8.5 l 8.5,3.8 l -8.5,3.8 l -3.8,8.5 l -3.8,-8.5 l -8.5,-3.8 Z`}
            fill={stroke} fillOpacity="0.65" stroke="none" />
          <path
            d={`M ${cx-26} ${hcy-18} l 2.5,-5.5 l 2.5,5.5 l 5.5,2.5 l -5.5,2.5 l -2.5,5.5 l -2.5,-5.5 l -5.5,-2.5 Z`}
            fill={stroke} fillOpacity="0.45" stroke="none" />
        </>
      )}
    </g>
  );
}

export default function DoodlePodium({ top3 = [] }) {
  const [first, second, third] = top3;

  // Pastel palette — no gold/silver/bronze
  const LAV  = { fill: '#ddd6f8', stroke: '#9180c8', light: 'rgba(197,184,232,0.22)' };
  const PEACH = { fill: '#fde0c8', stroke: '#d4895a', light: 'rgba(247,197,160,0.22)' };
  const SAGE  = { fill: '#cde9df', stroke: '#5faa8a', light: 'rgba(181,213,197,0.22)' };

  const GROUND = 265;
  const BLOCK = {
    first:  { x: 155, w: 130, h: 110, col: LAV   },
    second: { x:  38, w: 112, h:  80, col: PEACH  },
    third:  { x: 292, w: 112, h:  60, col: SAGE   },
  };

  // Character top-y so feet sit just on the block top
  // blob total height ≈ 17 + (17+13-4) + (13+6+4) = 66px
  const BLOB_H = 64;
  const gap    =  2; // slight float above block

  const topY = {
    first:  GROUND - BLOCK.first.h  - BLOB_H - gap,
    second: GROUND - BLOCK.second.h - BLOB_H - gap,
    third:  GROUND - BLOCK.third.h  - BLOB_H - gap,
  };
  const cx = {
    first:  BLOCK.first.x  + BLOCK.first.w  / 2,
    second: BLOCK.second.x + BLOCK.second.w / 2,
    third:  BLOCK.third.x  + BLOCK.third.w  / 2,
  };

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <svg
        viewBox="0 0 440 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/* ── Podium blocks ── */}
        {/* 2nd – peach */}
        <rect
          x={BLOCK.second.x} y={GROUND - BLOCK.second.h}
          width={BLOCK.second.w} height={BLOCK.second.h}
          rx="12" fill={PEACH.light} stroke={PEACH.stroke} strokeWidth="2"
        />
        <text x={BLOCK.second.x + BLOCK.second.w / 2} y={GROUND - 10}
          textAnchor="middle" fill={PEACH.stroke}
          fontFamily="Sofia, cursive" fontSize="28" fontWeight="bold">2</text>

        {/* 1st – lavender */}
        <rect
          x={BLOCK.first.x} y={GROUND - BLOCK.first.h}
          width={BLOCK.first.w} height={BLOCK.first.h}
          rx="12" fill={LAV.light} stroke={LAV.stroke} strokeWidth="2"
        />
        <text x={BLOCK.first.x + BLOCK.first.w / 2} y={GROUND - 10}
          textAnchor="middle" fill={LAV.stroke}
          fontFamily="Sofia, cursive" fontSize="28" fontWeight="bold">1</text>

        {/* 3rd – sage */}
        <rect
          x={BLOCK.third.x} y={GROUND - BLOCK.third.h}
          width={BLOCK.third.w} height={BLOCK.third.h}
          rx="12" fill={SAGE.light} stroke={SAGE.stroke} strokeWidth="2"
        />
        <text x={BLOCK.third.x + BLOCK.third.w / 2} y={GROUND - 10}
          textAnchor="middle" fill={SAGE.stroke}
          fontFamily="Sofia, cursive" fontSize="28" fontWeight="bold">3</text>

        {/* ── Ground dashed line ── */}
        <line x1="18" y1={GROUND} x2="422" y2={GROUND}
          stroke="rgba(197,184,232,0.5)" strokeWidth="2" strokeDasharray="6 5" />

        {/* ── Blob characters ── */}
        {second && <BlobChar cx={cx.second} topY={topY.second} fill={PEACH.fill} stroke={PEACH.stroke} pose="second" />}
        {first  && <BlobChar cx={cx.first}  topY={topY.first}  fill={LAV.fill}   stroke={LAV.stroke}   pose="winner" />}
        {third  && <BlobChar cx={cx.third}  topY={topY.third}  fill={SAGE.fill}  stroke={SAGE.stroke}  pose="third"  />}
      </svg>

      {/* ── Name + time labels ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginTop: '-2px', padding: '0 4px',
      }}>
        {/* 2nd */}
        <div style={{ width: '28%', textAlign: 'center' }}>
          {second ? (
            <>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {second.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.78rem', color: PEACH.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
                {formatTime(second.total_time)}
              </div>
            </>
          ) : <div style={{ height: 36 }} />}
        </div>

        {/* 1st */}
        <div style={{ width: '36%', textAlign: 'center' }}>
          {first ? (
            <>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {first.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.86rem', color: LAV.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
                {formatTime(first.total_time)}
              </div>
            </>
          ) : <div style={{ height: 36 }} />}
        </div>

        {/* 3rd */}
        <div style={{ width: '28%', textAlign: 'center' }}>
          {third ? (
            <>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-dark)', fontFamily: 'Nunito, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {third.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.78rem', color: SAGE.stroke, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700 }}>
                {formatTime(third.total_time)}
              </div>
            </>
          ) : <div style={{ height: 36 }} />}
        </div>
      </div>
    </div>
  );
}
