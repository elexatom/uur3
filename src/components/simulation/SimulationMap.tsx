import React from 'react';
import { MapContainer, Polyline, Circle, Popup, Marker, useMapEvents } from 'react-leaflet';
import { Box, Typography, Button, MenuItem, Select, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAppStore } from '../../store/appStore';
import { useFleetStore } from '../../store/fleetStore';
import { useSimulationStore } from '../../store/simulationStore';
import type { SeverityType } from '../../store/simulationStore';
import { calculateSegmentCongestion, getTrafficColor, estimateStopDelay } from '../../services/simulationService';
import type { LatLngExpression } from 'leaflet';
import { BasemapSelector, BasemapTileLayer } from '../map/BasemapLayer.tsx';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const SEVERITIES: SeverityType[] = ['Low', 'Medium', 'High', 'Critical'];

export const SimulationMap: React.FC = () => {
  const { network } = useAppStore();
  const { units } = useFleetStore();
  const { 
    disruptions, isMapInjectionMode, addDisruption, 
    setMapInjectionMode, metrics, removeDisruption, updateDisruption 
  } = useSimulationStore();
  
  const handleMapClick = (lat: number, lng: number) => {
    if (!isMapInjectionMode) return;
    
    addDisruption({
      id: `sim-d-${Date.now()}`,
      lat,
      lng,
      label: 'Manual Injection',
      severity: 'Medium',
      radius: 350
    });
    setMapInjectionMode(false);
  };

  const severityColors = {
    Low: '#22c55e',
    Medium: '#eab308',
    High: '#fb8a00',
    Critical: '#ef4444'
  };

  const vehicleIcon = (type: string) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: white; border: 2px solid ${type === 'tram' ? '#fb8a00' : '#10a4ff'}; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><span style="font-size: 14px; color: ${type === 'tram' ? '#fb8a00' : '#10a4ff'};" class="material-symbols-outlined">${type === 'tram' ? 'tram' : 'directions_bus'}</span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <MapContainer
        center={[49.7437, 13.3736]}
        zoom={13}
        className="w-full h-full"
        zoomControl={false}
      >
        <BasemapTileLayer />

        <MapEvents onMapClick={handleMapClick} />

        {/* Network segments with traffic heatmap */}
        {network.segments.map((seg) => {
          const midIdx = Math.floor(seg.coords.length / 2);
          const [midLat, midLng] = seg.coords[midIdx];
          const congestion = calculateSegmentCongestion(midLat, midLng, metrics.congestion, disruptions);
          return (
            <Polyline
              key={seg.id}
              positions={seg.coords as LatLngExpression[]}
              pathOptions={{
                color: getTrafficColor(congestion),
                weight: 5,
                opacity: 0.7
              }}
            />
          );
        })}

        {/* Stops with Delay Estimation */}
        {network.stops.map(stop => {
          const delay = estimateStopDelay(stop.lat, stop.lng, metrics.delay, disruptions);
          return (
            <CircleMarker
              key={stop.id}
              center={[stop.lat, stop.lng]}
              radius={4}
              pathOptions={{
                fillColor: delay > 10 ? '#ef4444' : '#64748b',
                fillOpacity: 0.6,
                stroke: false
              }}
            >
              <Popup>
                <div className="p-1">
                  <Typography className="font-black text-xs leading-none mb-1">{stop.name}</Typography>
                  <Typography variant="caption" className="font-bold text-gray-500 block">
                    Estimated Delay: <span className={delay > 10 ? 'text-red-600' : 'text-blue-600'}>+{delay}m</span>
                  </Typography>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Active Vehicles */}
        {units.map(unit => (
          <Marker 
            key={unit.id} 
            position={[unit.lat, unit.lng]} 
            icon={vehicleIcon(unit.type)}
          >
            <Popup>
              <Box className="p-1 min-w-[140px]">
                <Typography className="font-black text-xs text-blue-600">{unit.id}</Typography>
                <Typography className="font-bold text-[10px] text-gray-900">{unit.line}</Typography>
                <Divider className="my-1" />
                <Typography variant="caption" className="text-gray-500 block">Status: <span className="font-black uppercase text-gray-800">{unit.status}</span></Typography>
                <Typography variant="caption" className="text-gray-500 block">Delay: <span className="font-black text-red-600">+{unit.delayMinutes}m</span></Typography>
              </Box>
            </Popup>
          </Marker>
        ))}

        {/* Interactive Disruptions */}
        {disruptions.map((d) => (
          <Circle
            key={d.id}
            center={[d.lat, d.lng]}
            radius={d.radius}
            pathOptions={{
              color: severityColors[d.severity],
              fillColor: severityColors[d.severity],
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '5, 5'
            }}
          >
            <Popup minWidth={180}>
              <Box className="p-1 space-y-2">
                <Box>
                  <Typography variant="overline" className="font-black text-gray-400 leading-none">Event</Typography>
                  <Typography className="font-bold text-gray-900 leading-tight text-sm">{d.label}</Typography>
                </Box>
                <Box>
                  <Select
                    fullWidth
                    size="small"
                    value={d.severity}
                    onChange={(e) => updateDisruption(d.id, { severity: e.target.value as SeverityType })}
                    sx={{ fontSize: '0.7rem', fontWeight: 900, borderRadius: '8px', bgcolor: '#f8fafc' }}
                  >
                    {SEVERITIES.map(s => <MenuItem key={s} value={s} sx={{ fontSize: '0.7rem', fontWeight: 700 }}>{s}</MenuItem>)}
                  </Select>
                </Box>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  color="error"
                  disableElevation
                  onClick={() => removeDisruption(d.id)}
                  startIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
                  sx={{ borderRadius: '8px', fontWeight: 900, textTransform: 'none', fontSize: '0.65rem' }}
                >
                  Remove
                </Button>
              </Box>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <BasemapSelector className="absolute top-4 left-4 z-[1000]" />

      {isMapInjectionMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black shadow-xl animate-bounce border-2 border-white/20">
          📍 CLICK ON MAP TO INJECT POINT
        </div>
      )}
    </div>
  );
};

// CircleMarker import was missing
import { CircleMarker } from 'react-leaflet';
