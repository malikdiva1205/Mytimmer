/**
 * DoodleIcons – thin-stroke SVG icon components matching the pastel aesthetic.
 * All icons use currentColor by default so they inherit from CSS text color.
 * Size defaults to 18px but is configurable via the `size` prop.
 */

const base = (size, children, extra = {}) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style: { display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...extra },
});

export function ClockIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <circle cx="12" cy="12" r="9.5" />
      <polyline points="12 6.5 12 12 15.5 14.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StopwatchIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <circle cx="12" cy="13" r="8" />
      <polyline points="12 9 12 13 14.5 15" />
      <line x1="9.5" y1="3" x2="14.5" y2="3" />
      <line x1="12" y1="3" x2="12" y2="5" />
      <line x1="19.5" y1="7" x2="21" y2="5.5" />
    </svg>
  );
}

export function PomodoroIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M6 3h12l-2 5H8L6 3z" />
      <path d="M8 8c0 5 8 5 8 0" />
      <path d="M6 21h12l-2-8H8L6 21z" />
      <line x1="9" y1="21" x2="9" y2="13" strokeOpacity="0.4" />
      <line x1="15" y1="21" x2="15" y2="13" strokeOpacity="0.4" />
    </svg>
  );
}

export function SunIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2.5" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="21.5" y2="12" />
      <line x1="5.6" y1="5.6" x2="7" y2="7" />
      <line x1="17" y1="17" x2="18.4" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="17" y2="7" />
      <line x1="7" y1="17" x2="5.6" y2="18.4" />
    </svg>
  );
}

export function CalendarIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrophyIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M7 3h10v6a5 5 0 0 1-10 0V3z" />
      <path d="M7 6H3a2 2 0 0 0 2 2l2-2z" strokeWidth="1.6" />
      <path d="M17 6h4a2 2 0 0 1-2 2l-2-2z" strokeWidth="1.6" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <path d="M8 21h8" />
      <path d="M9 17h6" strokeWidth="1.4" />
    </svg>
  );
}

export function TargetIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function ChartIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <line x1="3" y1="21" x2="21" y2="21" />
      <rect x="5" y="13" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="13" rx="1" />
      <rect x="15" y="4" width="4" height="17" rx="1" />
    </svg>
  );
}

export function BoltIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <polyline points="13 2 4.5 13.5 11.5 13.5 11 22 19.5 10.5 12.5 10.5 13 2" />
    </svg>
  );
}

export function HistoryIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M3 12a9 9 0 1 0 2-5.5" />
      <polyline points="3 3 3 7.5 7 7.5" />
      <polyline points="12 7 12 12 15 14.5" />
    </svg>
  );
}

export function BookIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="7" x2="15" y2="7" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="9" y1="11" x2="15" y2="11" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}

export function PencilIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export function PlayIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'} fill={color || 'currentColor'} strokeWidth={0}>
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

export function PauseIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <rect x="6" y="4" width="4" height="16" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="14" y="4" width="4" height="16" rx="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ResetIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M3 12a9 9 0 1 0 1.5-5" />
      <polyline points="3 3 3 8 8 8" />
    </svg>
  );
}

export function SaveIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  );
}

export function DashboardIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function HomeIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function MoonIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M21 12.8A9 9 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8z" />
    </svg>
  );
}

export function StarIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" />
    </svg>
  );
}

export function StartStudyIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <circle cx="12" cy="12" r="9.5" />
      <polygon points="10 8 18 12 10 16" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'} strokeWidth={2.2}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="14 6 20 12 14 18" />
    </svg>
  );
}

export function SleepIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M17 12.5A5 5 0 0 1 12 17.5" strokeWidth="2" />
      <text x="6" y="11" fontSize="7" fontFamily="Share Tech Mono, monospace" fill="currentColor" stroke="none">ZZ</text>
    </svg>
  );
}

export function BackIcon({ size = 14, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'} strokeWidth={2.5}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function VolumeOnIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" strokeLinejoin="round" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function VolumeOffIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" strokeLinejoin="round" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

export function CheckIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <polyline points="20 6 9 17 4 12" strokeWidth="2.5" />
    </svg>
  );
}
export function WarningIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M12 8v5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3l9.5 17h-19L12 3z" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function CoffeeIcon({ size = 18, color, style }) {
  return (
    <svg {...base(size, null, style)} stroke={color || 'currentColor'}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" strokeOpacity="0.5" />
      <line x1="10" y1="1" x2="10" y2="4" strokeOpacity="0.5" />
      <line x1="14" y1="1" x2="14" y2="4" strokeOpacity="0.5" />
    </svg>
  );
}
export function CoffeeMugIcon({ size = 64, style }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))', ...style }}
    >
      {/* Animated Steam */}
      <g className="steam-container">
        <path d="M35 15c-2-5 2-10 0-15" stroke="#A1887F" strokeWidth="2.5" strokeLinecap="round" className="steam-line steam-1" />
        <path d="M50 15c-2-5 2-10 0-15" stroke="#A1887F" strokeWidth="2.5" strokeLinecap="round" className="steam-line steam-2" />
        <path d="M65 15c-2-5 2-10 0-15" stroke="#A1887F" strokeWidth="2.5" strokeLinecap="round" className="steam-line steam-3" />
      </g>

      {/* Lid - Slightly Irregular/Soft */}
      <path d="M25 25c0-3 5-5 25-5s25 2 25 5v5H25v-5z" fill="#4E342E" stroke="#2D1B17" strokeWidth="2" />
      <path d="M22 30h56v3c0 3-5 5-28 5s-28-2-28-5v-3z" fill="#5D4037" stroke="#2D1B17" strokeWidth="2" />
      
      {/* Cup Body - Tapered & Soft */}
      <path d="M28 38L32 90c1 4 5 7 18 7s17-3 18-7l4-52H28z" fill="#FDF5E6" stroke="#2D1B17" strokeWidth="2.2" />
      
      {/* Sleeve - Curved/Aesthetic */}
      <path d="M29 55c0-2 10-4 21-4s21 2 21 4l-1 18c0 2-10 4-20 4s-20-2-20-4l-1-18z" fill="#E69550" stroke="#2D1B17" strokeWidth="1.8" />
      
      {/* Heart - Larger/Central */}
      <path 
        d="M50 62.5c-2-2-4-1-4 1s2 3 4 4c2-1 4-2 4-4s-2-3-4-1z" 
        fill="#3E2723" 
        stroke="none" 
        transform="scale(1.8) translate(-22.5, -28)" 
      />
    </svg>
  );
}
