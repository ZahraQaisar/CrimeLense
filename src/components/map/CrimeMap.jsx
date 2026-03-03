import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const HeatmapLayer = ({ points }) => {
    const map = useMap();
    const heatLayerRef = useRef(null);

    useEffect(() => {
        if (!map || !points || !L.heatLayer) return;

        // Remove previous layer if it exists
        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
        }

        // Create new layer
        try {
            const heat = L.heatLayer(points, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                max: 1.0,
                gradient: {
                    0.4: '#14F1D9', // Neon Teal
                    0.6: '#F59E0B', // Warning Amber
                    1.0: '#FF4D4D'  // Danger Red
                }
            });

            heat.addTo(map);
            heatLayerRef.current = heat;
        } catch (error) {
            console.error("Error creating heat layer:", error);
        }

        return () => {
            if (heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
            }
        };
    }, [map, points]);

    return null;
};

const CrimeMap = ({ center = [51.505, -0.09], zoom = 13, heatmapData, markers = [], polylines = [], height = "100%" }) => {
    return (
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg relative z-0" style={{ height }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {heatmapData && <HeatmapLayer points={heatmapData} />}

                {polylines.map((line, idx) => (
                    <Polyline
                        key={idx}
                        positions={line.positions}
                        pathOptions={{ color: line.color, dashArray: line.dashArray, weight: line.weight || 4 }}
                    />
                ))}

                {markers.map((marker, idx) => (
                    <Marker key={idx} position={marker.position}>
                        <Popup className="glass-popup">
                            <div className="p-2">
                                <h3 className="font-bold text-deep-navy">{marker.title}</h3>
                                <p className="text-sm text-gray-600">{marker.desc}</p>
                                <div className={`mt-2 text-xs font-bold px-2 py-1 rounded-full inline-block ${marker.risk === 'High' ? 'bg-red-100 text-red-600' :
                                    marker.risk === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                        'bg-green-100 text-green-600'
                                    }`}>
                                    {marker.risk} Risk
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default CrimeMap;
