'use client';

import { memo } from 'react';

export const AuroraText = memo(function AuroraText({
  children,
  className = '',
  colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
  speed = 1,
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animationDuration: `${10 / speed}s`,
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="sr-only">{children}</span>
      <span className="aurora-text" style={gradientStyle} aria-hidden="true">
        {children}
      </span>
    </span>
  );
});
