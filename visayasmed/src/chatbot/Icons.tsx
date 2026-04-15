import React from 'react';

export const SendIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = 'currentColor',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MicrophoneIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = 'currentColor',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 1C9.791 1 8 2.791 8 5V12C8 14.209 9.791 16 12 16C14.209 16 16 14.209 16 12V5C16 2.791 14.209 1 12 1Z"
      fill={color}
    />
    <line x1="12" y1="16" x2="12" y2="23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5" y1="23" x2="19" y2="23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
