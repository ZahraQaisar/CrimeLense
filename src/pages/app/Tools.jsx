import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Zap, Navigation, BarChart2, Target, ChevronDown } from 'lucide-react';
import ChipGroup from '../../components/ui/ChipGroup';
import RiskRing from '../../components/ui/RiskRing';
import RouteViz from '../../components/ui/RouteViz';
import CompareBar from '../../components/ui/CompareBar';

/* ─── helpers ─────────────────────────────────────────────────────── */
const inputStyle = () => ({
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
  padding: '10px 14px',
  color: 'var(--text-primary)',
  fontSize: 13,
  outline: 'none',
});

/* Wrapper for selects — positions the custom chevron absolutely */
const selectWrapStyle = { position: 'relative', width: '100%' };

/* Select-specific style — hides native arrow, adds right padding for chevron */
const selectStyle = () => ({
  ...inputStyle(),
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  paddingRight: 36,   /* space for the custom chevron */
  cursor: 'pointer',
});

/* Chevron overlay shared by all selects */
const SelectChevron = () => (
  <span style={{
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
  }}>
    <ChevronDown size={15} />
  </span>
);

const labelStyle = { color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, marginBottom: 6, display: 'block' };

const sampleCompareData = [
  { label: 'Downtown', score: 78 },
  { label: 'Midtown', score: 45 },
  { label: 'Riverside', score: 21 },
  { label: 'Northside', score: 61 },
];

/* ─── Crime Prediction Panel ─────────────────────────────────────── */
const CrimePredictionPanel = () => {
  const [zone, setZone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('any');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allZones, setAllZones] = useState(['Downtown', 'Midtown', 'Northside', 'Eastgate', 'Riverside', 'Westbrook']);

  const handleAddZone = () => {
    if (!zone.trim()) return;
    const newZone = zone.trim();
    if (!allZones.includes(newZone)) {
      setAllZones([...allZones, newZone]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zone || !date) return;
    setLoading(true);
    setTimeout(() => {
      setResult({
        score: Math.floor(Math.random() * 100),
        factors: {
          'Top Factor': 'Night-time foot traffic',
          'Peak Time': '10 PM – 2 AM',
          'Trend': '↓ Declining',
          'Confidence': '87%',
        },
      });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1">
      <div className="p-6 flex flex-col gap-5" style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label style={labelStyle}>Zone / District</label>
            <div className="flex gap-2">
              <input value={zone} onChange={e => setZone(e.target.value)} placeholder="Search or add custom area..." style={{ ...inputStyle(), flex: 1 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'} 
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddZone(); } }} />
              <button 
                 type="button"
                 onClick={handleAddZone} 
                 className="px-4 rounded-lg text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shrink-0"
                 style={{ color: 'var(--text-primary)' }}
              >
                 Add
              </button>
            </div>
            <div className="mt-3"><ChipGroup chips={allZones} selected={zone} onSelect={setZone} /></div>
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inputStyle(), colorScheme: 'dark' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
          </div>
          <div>
            <label style={labelStyle}>Time of day</label>
            <div style={selectWrapStyle}>
              <select value={time} onChange={e => setTime(e.target.value)} style={selectStyle()}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'}>
                <option value="any">Any time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
              <SelectChevron />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-150"
            style={{ background: 'var(--accent)', color: '#0b0e14', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Analyze Risk
          </button>
        </form>
      </div>
      <div className="p-6 flex flex-col items-center justify-center min-h-[320px]">
        {loading && (
          <div className="flex flex-col gap-3 w-full">
            {[1, 2, 3].map(i => <div key={i} className="skeleton rounded-lg" style={{ height: 20, width: `${70 + i * 10}%` }} />)}
          </div>
        )}
        {!loading && !result && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: 'var(--border-subtle)' }}>
              <Target size={24} style={{ color: 'var(--text-faint)' }} />
            </div>
            <p className="text-sm max-w-[200px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
              Fill in the district and date to generate your risk prediction.
            </p>
          </div>
        )}
        {!loading && result && (
          <div className="flex flex-col items-center gap-6 w-full" style={{ animation: 'fadeUp 0.2s ease forwards' }}>
            <RiskRing score={result.score} size={120} />
            <div className="grid grid-cols-2 gap-2 w-full">
              {Object.entries(result.factors).map(([key, val]) => (
                <div key={key} className="rounded-lg p-3" style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>{key}</p>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Safe Route Panel ───────────────────────────────────────────── */
const SafeRoutePanel = () => {
  const location = useLocation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [travelTime, setTravelTime] = useState('now');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const startParam = params.get('start');
    const endParam = params.get('end');
    const runParam = params.get('run');

    if (startParam) setFrom(startParam);
    if (endParam) setTo(endParam);

    if (runParam === 'true' && startParam && endParam) {
      setLoading(true);
      setTimeout(() => {
        setResult({ safeRisk: Math.floor(Math.random() * 30) + 10, avoidRisk: Math.floor(Math.random() * 30) + 60 });
        setLoading(false);
      }, 900);
    }
  }, [location.search]);

  const handleGPS = () => {
    if (!navigator.geolocation) { setGpsError('Geolocation not supported.'); return; }
    setGpsLoading(true); setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFrom(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setGpsLoading(false);
      },
      () => { setGpsError('Location access denied. Type your start manually.'); setGpsLoading(false); },
      { timeout: 10000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to) return;
    setLoading(true);
    setTimeout(() => {
      setResult({ safeRisk: Math.floor(Math.random() * 30) + 10, avoidRisk: Math.floor(Math.random() * 30) + 60 });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1">
      <div className="p-6 flex flex-col gap-5" style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label style={labelStyle}>Starting point</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Central Station" style={{ ...inputStyle(), flex: 1 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
              <button type="button" onClick={handleGPS} title="Use my current location"
                style={{ padding: '0 12px', borderRadius: 8, background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 42 }}
              >
                {gpsLoading
                  ? <span style={{ width: 16, height: 16, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', display: 'block', animation: 'spin 0.7s linear infinite' }} />
                  : '📍'}
              </button>
            </div>
            {gpsError && <p style={{ color: 'var(--danger)', fontSize: 11, marginTop: 4 }}>{gpsError}</p>}
          </div>
          <div>
            <label style={labelStyle}>Destination</label>
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Eastgate Mall" style={inputStyle()}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'} />
          </div>
          <div>
            <label style={labelStyle}>Travel time</label>
            <div style={selectWrapStyle}>
              <select value={travelTime} onChange={e => setTravelTime(e.target.value)} style={selectStyle()}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'}>
                <option value="now">Now</option>
                <option value="morning">Morning rush</option>
                <option value="evening">Evening rush</option>
                <option value="night">Night</option>
              </select>
              <SelectChevron />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-150"
            style={{ background: 'var(--accent)', color: '#0b0e14', fontWeight: 700 }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Find Safe Route
          </button>
        </form>
      </div>
      <div className="p-6 flex flex-col items-center justify-center min-h-[320px]">
        {loading && <div className="flex flex-col gap-3 w-full">{[1, 2, 3].map(i => <div key={i} className="skeleton rounded-lg" style={{ height: 20 }} />)}</div>}
        {!loading && !result && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: 'var(--border-subtle)' }}>
              <Navigation size={24} style={{ color: 'var(--text-faint)' }} />
            </div>
            <p className="text-sm max-w-[200px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
              Enter your start and destination to find the safest route.
            </p>
          </div>
        )}
        {!loading && result && <RouteViz safeRisk={result.safeRisk} avoidRisk={result.avoidRisk} />}
      </div>
    </div>
  );
};

/* ─── Compare Areas Panel ────────────────────────────────────────── */
const CompareAreasPanel = () => {
  const [allAreas, setAllAreas] = useState(['Downtown', 'Midtown', 'Northside', 'Eastgate', 'Riverside', 'Westbrook']);
  const [selected, setSelected] = useState(['Downtown', 'Midtown', 'Riverside']);
  const [timePeriod, setTimePeriod] = useState('7d');
  const [crimeType, setCrimeType] = useState('all');
  const [customArea, setCustomArea] = useState('');
  const [compareData, setCompareData] = useState(sampleCompareData);
  const [loading, setLoading] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);

  const displayData = compareData.filter(d => selected.includes(d.label));

  const handleAddArea = () => {
    if (!customArea.trim()) return;
    const newArea = customArea.trim();
    if (allAreas.includes(newArea)) return; // Prevent duplicates
    
    setAllAreas([...allAreas, newArea]);
    
    // Auto-select if under maximum of 3
    if (selected.length < 3) {
      setSelected([...selected, newArea]);
    }
    
    // Assign a randomized score for the new mock area
    setCompareData([...compareData, { label: newArea, score: Math.floor(Math.random() * 60) + 10 }]);
    setCustomArea('');
  };

  const handleCompare = () => {
      if (selected.length === 0) {
          alert('Please select at least one area to compare.');
          return;
      }
      setLoading(true);
      setTimeout(() => {
          // Randomize scores to mock fetching new filtered data
          const newData = compareData.map(d => ({
              ...d,
              score: selected.includes(d.label) ? Math.floor(Math.random() * 85) + 5 : d.score
          }));
          setCompareData(newData);
          setHasCompared(true);
          setLoading(false);
      }, 700);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1">
      <div className="p-6 flex flex-col gap-5" style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div>
          <label style={labelStyle}>Select areas to compare (up to 3)</label>
          <div className="flex gap-2 mb-3">
             <input 
                value={customArea} 
                onChange={e => setCustomArea(e.target.value)} 
                placeholder="Search or add custom area..." 
                style={inputStyle()} 
                onFocus={e => e.target.style.borderColor = 'var(--accent)'} 
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                onKeyDown={e => e.key === 'Enter' && handleAddArea()} 
             />
             <button 
                onClick={handleAddArea} 
                type="button"
                className="px-4 rounded-lg text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors shrink-0"
             >
                Add
             </button>
          </div>
          <ChipGroup chips={allAreas} selected={selected} onSelect={setSelected} multi maxSelect={3} />
        </div>
        <div>
          <label style={labelStyle}>Time period</label>
          <div style={selectWrapStyle}>
            <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)} style={selectStyle()}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'}>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <SelectChevron />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Crime type</label>
          <div style={selectWrapStyle}>
            <select value={crimeType} onChange={e => setCrimeType(e.target.value)} style={selectStyle()}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-default)'}>
              <option value="all">All crime types</option>
              <option value="theft">Theft</option>
              <option value="assault">Assault</option>
              <option value="vandalism">Vandalism</option>
              <option value="burglary">Burglary</option>
            </select>
            <SelectChevron />
          </div>
        </div>
        <button 
          onClick={handleCompare}
          className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-150"
          style={{ background: 'var(--accent)', color: '#0b0e14', fontWeight: 700 }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {loading ? 'Comparing...' : 'Compare Now'}
        </button>
      </div>
      <div className="p-6 flex flex-col gap-4 justify-center min-h-[320px]">
        {loading && <div className="flex flex-col gap-3 w-full">{[1, 2, 3].map(i => <div key={i} className="skeleton rounded-lg" style={{ height: 20 }} />)}</div>}
        
        {!loading && !hasCompared && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: 'var(--border-subtle)' }}>
              <BarChart2 size={24} style={{ color: 'var(--text-faint)' }} />
            </div>
            <p className="text-sm max-w-[200px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
              Select areas and adjust filters to run a side-by-side comparison.
            </p>
          </div>
        )}

        {!loading && hasCompared && (
           <div style={{ animation: 'fadeUp 0.2s ease forwards' }}>
              <h4 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Risk comparison results</h4>
              <div className="flex flex-col gap-3">
                {displayData.map(d => <CompareBar key={d.label} label={d.label} score={d.score} />)}
              </div>
              <p className="text-xs leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                {displayData.length > 0 ? `${displayData.reduce((prev, curr) => prev.score > curr.score ? prev : curr).label} leads with the highest aggregated risk profile for the selected criteria.` : 'No areas selected for comparison.'}
              </p>
           </div>
        )}
      </div>
    </div>
  );
};

/* ─── Panel header ───────────────────────────────────────────────── */
const PanelHeader = ({ icon: Icon, name, description }) => (
  <div className="flex items-center gap-4 px-6 py-4" style={{ background: 'var(--surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
    <div className="flex items-center justify-center rounded-xl shrink-0"
      style={{ width: 44, height: 44, background: 'rgba(38, 204, 194, 0.08)', border: '1px solid rgba(38, 204, 194, 0.3)' }}>
      <Icon size={20} color="#26CCC2" />
    </div>
    <div>
      <h2 className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>{name}</h2>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  </div>
);

/* ─── Tools Page ─────────────────────────────────────────────────── */
const TOOLS = [
  { id: 'prediction', label: 'Crime Prediction', icon: Zap, description: 'AI risk scoring for any district and date.', panel: CrimePredictionPanel },
  { id: 'route', label: 'Safe Route', icon: Navigation, description: 'Find the safest path between two points.', panel: SafeRoutePanel },
  { id: 'compare', label: 'Compare Areas', icon: BarChart2, description: 'Side-by-side risk comparison across districts.', panel: CompareAreasPanel },
];

const Tools = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const toolParam = params.get('tool');
  const [activeTab, setActiveTab] = useState(toolParam || 'prediction');

  useEffect(() => {
    if (toolParam && TOOLS.find(t => t.id === toolParam)) setActiveTab(toolParam);
  }, [toolParam]);

  const handleTab = (id) => {
    setActiveTab(id);
    navigate(`/app/tools?tool=${id}`, { replace: true });
  };

  const ActiveTool = TOOLS.find(t => t.id === activeTab) || TOOLS[0];
  const ActivePanel = ActiveTool.panel;

  return (
    <div className="flex flex-col gap-6 max-w-[1100px]">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>Tools</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Select a tool to get started.</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}>
        {TOOLS.map((tool) => {
          const isActive = activeTab === tool.id;
          const ToolIcon = tool.icon;
          return (
            <button key={tool.id} onClick={() => handleTab(tool.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2"
              style={{
                background: isActive ? 'var(--surface)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
              }}>
              <ToolIcon size={16} color={isActive ? '#26CCC2' : '#6B7280'} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool panel card */}
      <div className="rounded-2xl overflow-hidden flex flex-col"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)' }}
        key={activeTab}>
        <PanelHeader icon={ActiveTool.icon} name={ActiveTool.label} description={ActiveTool.description} />
        <ActivePanel />
      </div>
    </div>
  );
};

export default Tools;
