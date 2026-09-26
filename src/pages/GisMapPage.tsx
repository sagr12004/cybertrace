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
} from 'lucide-react';
import { AtmLocation, Complaint, WithdrawalPrediction } from '../types';

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
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [showHeatCircles, setShowHeatCircles] = useState(true);
  const [tileError, setTileError] = useState(false);

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
          attribution: '&copy; OpenStreetMap contributors | CyberTrace AI (SIH Pilot)',
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
    predictions.forEach((pred) => {
      if (riskFilter !== 'ALL' && pred.riskCategory !== riskFilter) return;

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
    atms.forEach((atm) => {
      const isCandidate = predictions.some((p) =>
        p.candidateAtms.some((c) => c.atmId === atm.id)
      );

      const markerColor = isCandidate ? '#DC2626' : '#2563EB';

      const customIcon = L.divIcon({
        className: 'custom-atm-marker',
        html: `
          <div style="
            background: ${markerColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            cursor: pointer;
          ">
            ₹
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([atm.latitude, atm.longitude], { icon: customIcon }).addTo(
        layerGroup
      );

      marker.on('click', () => {
        setSelectedAtm(atm);
      });
    });

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [atms, predictions, riskFilter, showHeatCircles]);

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
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>GIS Geospatial Map &amp; Withdrawal Hotspot Heatmap</span>
            </h2>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Bengaluru Pilot
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            OpenStreetMap live spatial layers with ATM locations and ML-predicted cashout radii
          </p>
        </div>

        {/* Filters and Layer Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Risk Zones</option>
            <option value="High">High Risk Only (&gt; 75%)</option>
            <option value="Medium">Medium Risk (45-75%)</option>
          </select>

          <button
            onClick={() => setShowHeatCircles(!showHeatCircles)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showHeatCircles
                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {showHeatCircles ? 'Hotspot Radii: ON' : 'Hotspot Radii: OFF'}
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
        <div className="absolute bottom-6 left-6 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300">
          <div className="font-bold text-slate-800 dark:text-slate-100 text-xs mb-1">GIS Map Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-white shadow-2xs" />
            <span>High-Risk Candidate ATM (Target)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-2xs" />
            <span>Bengaluru ATM Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500 border-dashed" />
            <span>Predicted Interception Radius (±1.2km)</span>
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
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {selectedAtm ? (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {selectedAtm.atmCode}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{selectedAtm.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{selectedAtm.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-mono">Area</span>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedAtm.area}</div>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-mono">Cash Status</span>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Operational</div>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-mono">Historical Withdrawals</span>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {selectedAtm.totalHistoricalWithdrawals} events
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-mono">Fraud Density</span>
                    <div className="font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {selectedAtm.historicalFraudIncidentCount} incidents
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleFocusLocation(selectedAtm.latitude, selectedAtm.longitude)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all active:scale-98"
                >
                  Recenter Map on this ATM
                </button>
              </div>
            ) : selectedPrediction ? (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-rose-600 dark:text-rose-400">
                      {selectedPrediction.riskScore}% {selectedPrediction.riskCategory} Risk
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {selectedPrediction.timeWindowBucket}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                    {selectedPrediction.predictedZone}
                  </h3>
                </div>

                <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedPrediction.explanation}
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Candidate ATMs:</div>
                  {selectedPrediction.candidateAtms.slice(0, 2).map((atm) => (
                    <div
                      key={atm.atmId}
                      onClick={() => handleFocusLocation(atm.latitude, atm.longitude)}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-between text-[11px]"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-200">{atm.name}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">{atm.matchScore}%</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigateTab('alerts')}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98"
                >
                  Dispatch Field Alert for this Zone
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
