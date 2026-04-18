/**
 * LAPD Reporting Areas — the 21 police divisions used in the CrimeLense dataset.
 * All dropdown / suggestion lists across the app should import from here
 * so that only areas with real training data are shown to users.
 */

export const LA_AREAS = [
  { label: '77th Street',   lat: 33.9561, lon: -118.2785 },
  { label: 'Central',       lat: 34.0407, lon: -118.2468 },
  { label: 'Devonshire',    lat: 34.2574, lon: -118.5287 },
  { label: 'Foothill',      lat: 34.2621, lon: -118.4080 },
  { label: 'Harbor',        lat: 33.7886, lon: -118.2817 },
  { label: 'Hollenbeck',    lat: 34.0475, lon: -118.2107 },
  { label: 'Hollywood',     lat: 34.0928, lon: -118.3287 },
  { label: 'Mission',       lat: 34.2728, lon: -118.4390 },
  { label: 'N Hollywood',   lat: 34.1870, lon: -118.3813 },
  { label: 'Newton',        lat: 33.9966, lon: -118.2549 },
  { label: 'Northeast',     lat: 34.1125, lon: -118.2283 },
  { label: 'Olympic',       lat: 34.0480, lon: -118.3053 },
  { label: 'Pacific',       lat: 33.9586, lon: -118.4187 },
  { label: 'Rampart',       lat: 34.0621, lon: -118.2764 },
  { label: 'Southeast',     lat: 33.9393, lon: -118.2517 },
  { label: 'Southwest',     lat: 34.0132, lon: -118.2981 },
  { label: 'Topanga',       lat: 34.1989, lon: -118.6091 },
  { label: 'Van Nuys',      lat: 34.1897, lon: -118.4484 },
  { label: 'West LA',       lat: 34.0380, lon: -118.4310 },
  { label: 'West Valley',   lat: 34.1944, lon: -118.5370 },
  { label: 'Wilshire',      lat: 34.0614, lon: -118.3294 },
];

/** Just the area name strings — for simple suggestion / chip lists */
export const AREA_NAMES = LA_AREAS.map(a => a.label);

export default LA_AREAS;
