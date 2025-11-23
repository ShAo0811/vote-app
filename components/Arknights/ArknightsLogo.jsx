import React from 'react';

const ArknightsLogo = () => (
  <svg 
    width="240" 
    height="70" 
    viewBox="0 0 240 70" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="arknightsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff9100" />
        <stop offset="100%" stopColor="#ff6b00" />
      </linearGradient>
    </defs>
    <path 
      d="M32.5,10 L10,25 L10,45 L32.5,60 L55,45 L55,25 Z" 
      stroke="url(#arknightsGradient)" 
      strokeWidth="2" 
      fill="none"
    />
    <text 
      x="70" 
      y="45" 
      fontFamily="Arial, sans-serif" 
      fontSize="28" 
      fontWeight="bold" 
      fill="url(#arknightsGradient)"
    >
      ARKNIGHTS
    </text>
  </svg>
);

export default ArknightsLogo; 