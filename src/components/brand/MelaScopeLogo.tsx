import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function MelaScopeLogo({
  className = '',
  size = 'md',
  showSubtitle = true,
}: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Bespoke Geometric Mela Canopy & Beacon Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] via-[#047857] to-[#065f46] shadow-sm shadow-[#059669]/20 border border-[#10b981]/30 p-1.5`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Canopy Roof / Pavilion Architecture */}
          <path
            d="M16 3L3 13H29L16 3Z"
            fill="currentColor"
            fillOpacity="0.95"
          />
          {/* Scalloped decorative valance */}
          <path
            d="M3 13C5 15.5 7 15.5 9 13C11 15.5 13 15.5 15 13C17 15.5 19 15.5 21 13C23 15.5 25 15.5 27 13C28 14.5 29 14.5 29 13"
            stroke="#a7f3d0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Structural Pillars */}
          <path
            d="M6 15V27M16 15V27M26 15V27"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Ground Stage Plinth */}
          <path
            d="M4 27H28"
            stroke="#a7f3d0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Central Commercial Target / Location Pin Hub */}
          <circle cx="16" cy="20" r="3" fill="#34d399" />
          <circle cx="16" cy="20" r="1.25" fill="#064e3b" />
        </svg>
      </div>

      {/* Brand Wordmark & Geography Badge */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-[#0f291e] ${textSizes[size]}`}>
            Mela<span className="text-[#059669]">Scope</span>
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] uppercase tracking-wider">
            NCR
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-medium text-[#527964] -mt-0.5 tracking-tight hidden sm:inline">
            Stall Intelligence & Venue Discovery
          </span>
        )}
      </div>
    </div>
  );
}
