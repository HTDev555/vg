
import React from 'react';

export const HexIcon: React.FC<{ size?: number; className?: string; color?: string }> = ({ 
  size = 48, 
  className = "", 
  color = "#2563EB" 
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="filter drop-shadow-lg"
      >
        <path
          d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
          fill="none"
          stroke={color}
          strokeWidth="6"
          className="transition-all duration-300"
        />
        <circle cx="50" cy="50" r="10" fill={color} className="animate-pulse" />
        <path
          d="M50 15 L50 35 M50 65 L50 85 M20 33 L38 43 M62 57 L80 67 M20 67 L38 57 M62 43 L80 33"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
