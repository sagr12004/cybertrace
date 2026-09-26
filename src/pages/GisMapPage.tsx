import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  ShieldAlert,
  Target,
  ExternalLink,
  Layers,
  Compass,
  Building,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  Car,
  Radio,
  Calendar,
  Layers2,
  Tag,
  Crosshair,
  ArrowLeft,
} from 'lucide-react';
import { AtmLocation, Complaint, CrimeCategory, TimeWindow, WithdrawalPrediction } from '../types';

interface GisMapPageProps {
  atms: AtmLocation[];
  predictions: WithdrawalPrediction[];
  activeComplaint: Complaint;
  onNavigateTab: (tab: any) => void;
}

export const GisMapPage: React.FC<GisMapPageProps> = ({
  atms,
  predictions,
  activeComplaint,
  onNavigateTab,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedAtm, setSelectedAtm] = useState<AtmLocation | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<WithdrawalPrediction | null>(
    predictions[0] || null
  );

  // Drill-down filters required by SIH Deliverable B:
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [timeFilter, setTimeFilter] = useState<'ALL' | TimeWindow>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showHeatCircles, setShowHeatCircles] = useState(true);
  const [showPatrolUnits, setShowPatrolUnits] = useState(true);
  const [tileError, setTileError] = useState(false);

  // Simulated Police PCR Patrol Units for real-time LEA interception
  const patrolUnits = [
    { id: 'PCR-KOR-04', name: 'Cheetah Patrol 04 (Koramangala)', lat: 12.9325, lng: 77.6210, status: 'En Route to SBI-KOR-501', eta: '3 mins' },
    { id: 'PCR-BTM-02', name: 'Hoysala Patrol 02 (BTM Layout)', lat: 12.9180, lng: 77.6080, status: 'Patrolling 7th Main', eta: 'Stationary' },
    { id: 'PCR-IND-01', name: 'Cheetah Patrol 01 (Indiranagar)', lat: 12.9690, lng: 77.6390, status: 'Standby 100ft Rd', eta: 'Stationary' },
  ];

  // Unique areas from ATMs and Predictions
  const availableAreas = Array.from(
    new Set([
      ...atms.map((a) => a.area),
      ...predictions.map((p) => p.predictedZone.split(' ')[0]),
    ])
  );

  // Filtered Predictions based on time, location, and risk
  const filteredPredictions = predictions.filter((pred) => {
    if (riskFilter !== 'ALL' && pred.riskCategory !== riskFilter) return false;
    if (timeFilter !== 'ALL' && pred.timeWindowBucket !== timeFilter) return false;
    if (locationFilter !== 'ALL' && !pred.predictedZone.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    return true;
  });

  // Filtered ATMs based on location
  const filteredAtms = atms.filter((atm) => {
    if (locationFilter !== 'ALL' && atm.area.toLowerCase() !== locationFilter.toLowerCase()) return false;
    return true;
  });

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Bengaluru: [12.935, 77.625]
      const map = L.map(mapContainerRef.current, {
        center: [12.935, 77.625],
        zoom: 12.5,
        zoomControl: true,
      });

      const tileLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors | CyberTrace',
          maxZoom: 18,
        }
      );

      tileLayer.on('tileerror', () => {
        setTileError(true);
      });

      tileLayer.addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers and layers
    const layerGroup = L.layerGroup().addTo(map);

    // 1. Draw Predicted Hotspot Zones (Circles with risk shading)
    filteredPredictions.forEach((pred) => {
      const isHigh = pred.riskCategory === 'High';
      const color = isHigh ? '#EF4444' : '#F59E0B';

      if (showHeatCircles) {
        // Outer buffer circle
        const circle = L.circle([pred.predictedCenterLat, pred.predictedCenterLng], {
          radius: pred.confidenceRadiusMeters,
          color: color,
          fillColor: color,
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '5, 5',
        }).addTo(layerGroup);

        circle.on('click', () => {
          setSelectedPrediction(pred);
          setSelectedAtm(null);
        });

        // Inner epicenter circle
        L.circle([pred.predictedCenterLat, pred.predictedCenterLng], {
          radius: 400,
          color: color,
          fillColor: color,
          fillOpacity: 0.45,
          weight: 1.5,
        }).addTo(layerGroup);
      }
    });

    // 2. Draw ATM Markers
    filteredAtms.forEach((atm) => {
      const isCandidate = predictions.some((p) =>
        p.candidateAtms.some((c) => c.atmId === atm.id)
      );

      const markerColor = isCandidate ? '#DC2626' : '#2563EB';

      const customIcon = L.divIcon({
        className: 'custom-atm-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">
            ₹
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([atm.latitude, atm.longitude], { icon: customIcon }).addTo(
        layerGroup
      );

      marker.on('click', () => {
        setSelectedAtm(atm);
        setSelectedPrediction(null);
      });
    });

    // 3. Draw Police Patrol Units
    if (showPatrolUnits) {
      patrolUnits.forEach((unit) => {
        const patrolIcon = L.divIcon({
          className: 'custom-patrol-marker',
          html: `
            <div style="
              background-color: #10B981;
              width: 26px;
              height: 26px;
              border-radius: 8px;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
            ">
              🚓
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const patrolMarker = L.marker([unit.lat, unit.lng], { icon: patrolIcon }).addTo(layerGroup);
        patrolMarker.bindPopup(`<strong>${unit.name}</strong><br/>Status: ${unit.status}<br/>ETA: ${unit.eta}`);
      });
    }

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [filteredAtms, filteredPredictions, showHeatCircles, showPatrolUnits]);

  // Center map on selected ATM or Hotspot
  const handleFocusLocation = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.2 });
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('overview')}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>GIS Geospatial Risk &amp; Withdrawal Hotspot Heatmap</span>
            </h2>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Live Tactical Map
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time and potential withdrawal risk zones with drill-downs by time window, jurisdiction, and crime vector
          </p>
        </div>

        {/* Drill-down Filters requested by SIH Brief */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Window Drill-down */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="text-xs bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL">All Time Windows</option>
              <option value="0-6 hours">0-6 hrs (Critical)</option>
              <option value="6-12 hours">6-12 hrs</option>
              <option value="12-24 hours">12-24 hrs</option>
              <option value="Over 24 hours">&gt;24 hrs</option>
            </select>
          </div>

          {/* Location / Jurisdiction Drill-down */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL">All Subdivisions</option>
              {availableAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="High">High Risk (&gt;75%)</option>
            <option value="Medium">Medium Risk (45-75%)</option>
          </select>

          {/* Layer Toggles */}
          <button
            onClick={() => setShowHeatCircles(!showHeatCircles)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showHeatCircles
                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {showHeatCircles ? 'Hotspot Radii: ON' : 'Hotspot Radii: OFF'}
          </button>

          <button
            onClick={() => setShowPatrolUnits(!showPatrolUnits)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
              showPatrolUnits
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-emerald-500" />
            <span>PCR Vans: {showPatrolUnits ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Container & Inspection Drawer */}
      <div className="flex-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden relative shadow-2xs flex bg-slate-100 dark:bg-[#070b14]">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Fallback Notice if tiles fail */}
        {tileError && (
          <div className="absolute top-4 left-4 z-10 p-3 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 shadow-md max-w-sm">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>External Map Tiles Notice</span>
            </div>
            <p className="text-[11px] mt-1">
              External OpenStreetMap tiles are experiencing network latency. Geospatial coordinates, ATM pins, and hotspot radii are functioning accurately.
            </p>
          </div>
        )}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-800 dark:text-slate-100 text-xs mb-1">GIS Tactical Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-white shadow-2xs" />
            <span>Predicted Target ATM (High Velocity Cashout)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-2xs" />
            <span>Monitored Banking ATM Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500 border border-white shadow-2xs flex items-center justify-center text-[8px] text-white">🚓</span>
            <span>Active Police Patrol PCR Van</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500 border-dashed" />
            <span>Predicted Hotspot Radius (±1.2km)</span>
          </div>
        </div>

        {/* Detail Inspection Drawer (Right side overlay) */}
        {(selectedAtm || selectedPrediction) && (
          <div className="absolute top-4 right-4 w-80 max-w-[90%] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-4 z-10 space-y-3 animate-in fade-in slide-in-from-right-4 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {selectedAtm ? 'ATM Node Inspection' : 'Predicted Hotspot Zone'}
              </span>
              <button
                onClick={() => {
                  setSelectedAtm(null);
                  setSelectedPrediction(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {selectedAtm && (
              <div className="space-y-2.5 text-xs">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-snug">{selectedAtm.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{selectedAtm.atmCode}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Bank Name:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAtm.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Area:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAtm.area}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Cash Available:</span>
                    <span className={`font-bold ${selectedAtm.cashAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {selectedAtm.cashAvailable ? 'Yes (Loaded)' : 'Depleted'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">CCTV Status:</span>
                    <span className={`font-bold ${selectedAtm.cctvOperational ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {selectedAtm.cctvOperational ? 'Operational' : 'Non-operational'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleFocusLocation(selectedAtm.latitude, selectedAtm.longitude)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Recenter on Pin
                  </button>
                  <button
                    onClick={() => onNavigateTab('withdrawals')}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Historical Logs →
                  </button>
                </div>
              </div>
            )}

            {selectedPrediction && (
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      {selectedPrediction.riskScore}% {selectedPrediction.riskCategory} Risk
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Case: {selectedPrediction.complaintNumber}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                    {selectedPrediction.predictedZone}
                  </h3>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Window:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPrediction.timeWindowBucket}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Confidence Radius:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">±{selectedPrediction.confidenceRadiusMeters} meters</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Candidate ATMs:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{selectedPrediction.candidateAtms.length} locations</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedPrediction.explanation}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() =>
                      handleFocusLocation(
                        selectedPrediction.predictedCenterLat,
                        selectedPrediction.predictedCenterLng
                      )
                    }
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Center Epicenter
                  </button>
                  <button
                    onClick={() => onNavigateTab('alerts')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    Dispatch Alert →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
