import React from 'react';
import CrimeMap from '../map/CrimeMap';

/**
 * RouteViz — Interactive Leaflet map showing safe (teal) and avoid (red) routes
 */
const generateHeatmapPoints = () => {
    // Generate some mock heat map points around the 'avoid' route area
    const center = [51.507, -0.082];
    return Array.from({ length: 150 }).map(() => [
        center[0] + (Math.random() - 0.5) * 0.015,
        center[1] + (Math.random() - 0.5) * 0.015,
        Math.random() // Intensity
    ]);
};

const RouteViz = ({ safeRisk = 22, avoidRisk = 74 }) => {
  const heatPoints = generateHeatmapPoints();

  const polylines = [
      {
          positions: [[51.500, -0.090], [51.503, -0.095], [51.508, -0.098], [51.512, -0.100]], // Safe Route
          color: '#14F1D9', // Neon Teal
          dashArray: '8, 8',
          weight: 5
      },
      {
          positions: [[51.500, -0.090], [51.505, -0.080], [51.510, -0.085], [51.512, -0.100]], // Avoid Route
          color: '#ff4f6a', // Danger Red
          dashArray: '8, 12',
          weight: 4
      }
  ];

  const markers = [
      { position: [51.500, -0.090], title: 'Start Location', desc: 'Origin Point', risk: 'Low' },
      { position: [51.512, -0.100], title: 'Destination', desc: 'Target Location', risk: 'Low' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full h-[320px] pb-4" style={{ animation: 'fadeUp 0.2s ease forwards' }}>
      
      {/* Full interactive Crime Map taking up the main space */}
      <div className="h-full w-full relative -mx-2 bg-black rounded-lg overflow-hidden border border-white/5">
         <CrimeMap 
            center={[51.506, -0.090]} 
            zoom={14} 
            heatmapData={heatPoints} 
            markers={markers} 
            polylines={polylines} 
            height="100%" 
         />
      </div>

      {/* Badge pills for stats */}
      <div className="flex flex-wrap gap-2 shrink-0 justify-center">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
          style={{ background: 'rgba(20,241,217,0.12)', border: '1px solid rgba(20,241,217,0.3)', color: '#14F1D9' }}
        >
          <span>✓</span> Recommended Route (Risk {safeRisk})
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg"
          style={{ background: 'rgba(255,79,106,0.12)', border: '1px solid rgba(255,79,106,0.3)', color: '#ff4f6a' }}
        >
          <span>⚠</span> Avoid Alert (Risk {avoidRisk})
        </div>
      </div>
    </div>
  );
};

export default RouteViz;
