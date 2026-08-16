import React from 'react';

/**
 * Họa tiết ngăn cách Section dạng Mái ngói vảy cá / Sóng nước truyền thống Việt Nam
 */
export const SectionDivider = ({
  variant = 'tiles', // 'tiles' | 'wave' | 'simple'
  fill = '#FBF6EC',
  bg = 'transparent',
  className = '',
  flip = false,
}) => {
  if (variant === 'wave') {
    return (
      <div
        className={`w-full overflow-hidden leading-none ${className} ${flip ? 'rotate-180' : ''}`}
        style={{ backgroundColor: bg }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-8 md:h-12"
        >
          <path
            d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"
            fill={fill}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-center py-6 ${className}`}>
        <div className="h-[1px] bg-warmBorder w-24 md:w-36"></div>
        <div className="mx-4 flex items-center space-x-2 text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
        </div>
        <div className="h-[1px] bg-warmBorder w-24 md:w-36"></div>
      </div>
    );
  }

  // Variant: Traditional Vietnamese Roof Tile Pattern (Mái ngói vảy cá / âm dương)
  return (
    <div
      className={`w-full overflow-hidden leading-none ${className} ${flip ? 'rotate-180' : ''}`}
      style={{ backgroundColor: bg }}
    >
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        className="relative block w-full h-6 md:h-9"
      >
        <defs>
          <pattern id="roofTiles" width="40" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M0,24 C10,12 30,12 40,24 C30,36 10,36 0,24 Z"
              fill="none"
              stroke="#D9A441"
              strokeWidth="0.8"
              opacity="0.3"
            />
            <path
              d="M-20,12 C-10,0 10,0 20,12 C10,24 -10,24 -20,12 Z"
              fill="none"
              stroke="#8B5E3C"
              strokeWidth="0.6"
              opacity="0.25"
            />
          </pattern>
        </defs>
        <path
          d="M0,0 C300,30 600,0 900,25 C1050,37 1150,15 1200,20 L1200,48 L0,48 Z"
          fill={fill}
        />
        <rect width="1200" height="48" fill="url(#roofTiles)" />
      </svg>
    </div>
  );
};
