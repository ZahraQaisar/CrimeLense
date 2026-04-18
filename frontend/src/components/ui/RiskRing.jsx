import React, { useEffect, useRef } from 'react';

/**
 * RiskRing — circular SVG score display
 * The score number and label are rendered as SVG <text> elements
 * so they always stay perfectly centered inside the ring.
 *
 * Props: score (0-100), size (px)
 */
const RiskRing = ({ score = 0, size = 160 }) => {
  const isHigh = score >= 70;
  const isMed = score >= 35 && score < 70;
  const color = isHigh ? '#ff4f6a' : isMed ? '#ffaa3b' : '#00d4aa';
  const label = isHigh ? 'HIGH RISK' : isMed ? 'MODERATE' : 'LOW RISK';

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const progressRef = useRef(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transition = 'stroke-dashoffset 1s ease-out';
      progressRef.current.style.strokeDashoffset = String(offset);
    }
  }, [score, offset]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block' }}
    >
      {/* Track */}
      <circle
        cx={center} cy={center} r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={strokeWidth}
      />

      {/* Progress arc — rotated so it starts from the top */}
      <circle
        ref={progressRef}
        cx={center} cy={center} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ filter: `drop-shadow(0 0 8px ${color}90)` }}
      />

      {/* Score number — centered */}
      <text
        x={center}
        y={center - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={size * 0.22}
        fontWeight="800"
        fontFamily="'Space Grotesk', sans-serif"
      >
        {score}
      </text>

      {/* Label — centered below number */}
      <text
        x={center}
        y={center + size * 0.17}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={size * 0.085}
        fontWeight="600"
        fontFamily="'Space Grotesk', sans-serif"
        opacity="0.85"
        letterSpacing="2"
      >
        {label}
      </text>
    </svg>
  );
};

export default RiskRing;
