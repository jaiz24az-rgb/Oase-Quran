import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  LocateFixed,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  Info,
  CheckCircle2,
  Building,
  Camera,
  ExternalLink,
  Globe,
  Sparkles,
  RotateCw,
  Sliders,
  Footprints,
  ShieldCheck,
} from 'lucide-react';
import { LocationConfig } from '../types';
import { calculateQibla, KAABA_COORDINATES } from '../utils/prayerTimesTarjih';

interface DigitalQiblaMapProps {
  location: LocationConfig;
  onUpdateCoordinates?: (lat: number, lng: number, name?: string) => void;
  onOpenARMode?: () => void;
  heading?: number;
  className?: string;
}

export const DigitalQiblaMap: React.FC<DigitalQiblaMapProps> = ({
  location,
  onUpdateCoordinates,
  onOpenARMode,
  heading: externalHeading,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const kaabaMarkerRef = useRef<L.Marker | null>(null);
  const qiblaLineRef = useRef<L.Polyline | null>(null);
  const rayLineRef = useRef<L.Polyline | null>(null);
  const headingBeamRef = useRef<L.Polygon | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: location.latitude,
    lng: location.longitude,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isWatchLiveGps, setIsWatchLiveGps] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Motion Sensor State (Compass Heading from phone)
  const [sensorHeading, setSensorHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [isRotateWithPhone, setIsRotateWithPhone] = useState<boolean>(true); // Auto-rotate map with phone
  const [manualHeadingSimulation, setManualHeadingSimulation] = useState<number>(0);
  const [useSimulation, setUseSimulation] = useState<boolean>(false);

  // Low-pass filtered heading for 60fps silky smooth rotation
  const smoothedHeadingRef = useRef<number>(0);
  const [displayHeading, setDisplayHeading] = useState<number>(0);

  // Compute live Qibla bearing based on current coords
  const liveQibla = calculateQibla(currentCoords.lat, currentCoords.lng);

  // Effective Heading: external > sensor > simulation
  const effectiveRawHeading =
    useSimulation || (!hasCompassSensor && externalHeading === undefined)
      ? manualHeadingSimulation
      : externalHeading !== undefined
      ? externalHeading
      : sensorHeading;

  // Map tile URLs
  const TILE_STREET = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const TILE_SATELLITE =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  // 1. Listen to Device Orientation (Phone Movement Sensor)
  const setupOrientation = useCallback(() => {
    let sensorTriggered = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      sensorTriggered = true;
      setHasCompassSensor(true);

      const iosHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      let deg = 0;

      if (typeof iosHeading === 'number' && !isNaN(iosHeading)) {
        deg = (iosHeading + 360) % 360;
      } else if (e.alpha !== null) {
        const a = e.alpha || 0;
        const b = e.beta || 0;
        const g = e.gamma || 0;

        if (Math.abs(b) < 18 && Math.abs(g) < 18) {
          deg = (360 - a + 360) % 360;
        } else {
          // Tilt-compensated forward vector
          const degToRad = Math.PI / 180;
          const _a = a * degToRad;
          const _b = b * degToRad;
          const _g = g * degToRad;
          const cA = Math.cos(_a);
          const sA = Math.sin(_a);
          const cB = Math.cos(_b);
          const sB = Math.sin(_b);
          const cG = Math.cos(_g);
          const sG = Math.sin(_g);

          const vX = -cA * sG - sA * sB * cG;
          const vY = -sA * sG + cA * sB * cG;

          if (Math.hypot(vX, vY) > 0.05) {
            deg = (Math.atan2(-vX, vY) * (180 / Math.PI) + 360) % 360;
          } else {
            deg = (360 - a + 360) % 360;
          }
        }
      }

      setSensorHeading(deg);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener(
      'deviceorientationabsolute' as unknown as keyof WindowEventMap,
      handleOrientation as EventListener,
      true
    );

    const timer = setTimeout(() => {
      if (!sensorTriggered && externalHeading === undefined) {
        setHasCompassSensor(false);
      }
    }, 1500);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener(
        'deviceorientationabsolute' as unknown as keyof WindowEventMap,
        handleOrientation as EventListener,
        true
      );
      clearTimeout(timer);
    };
  }, [externalHeading]);

  useEffect(() => {
    const cleanup = setupOrientation();
    return cleanup;
  }, [setupOrientation]);

  // Request iOS motion sensor permission if needed
  const requestSensorPermission = async () => {
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DeviceOrientation?.requestPermission === 'function') {
      try {
        const resp = await DeviceOrientation.requestPermission();
        if (resp === 'granted') {
          setHasCompassSensor(true);
          setupOrientation();
          setInfoMessage('Sensor kompas ponsel berhasil diaktifkan!');
        }
      } catch (e) {
        console.warn('Sensor permission error', e);
      }
    } else {
      setupOrientation();
      setInfoMessage('Sensor kompas aktif.');
    }
    setTimeout(() => setInfoMessage(null), 3000);
  };

  // 2. Smooth Heading with RequestAnimationFrame
  useEffect(() => {
    let animId: number;

    const smoothStep = () => {
      const current = smoothedHeadingRef.current;
      let diff = effectiveRawHeading - current;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const next = (current + diff * 0.25 + 360) % 360;
      smoothedHeadingRef.current = next;
      setDisplayHeading(next);

      animId = requestAnimationFrame(smoothStep);
    };

    animId = requestAnimationFrame(smoothStep);
    return () => cancelAnimationFrame(animId);
  }, [effectiveRawHeading]);

  // 3. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = location.latitude;
    const initialLng = location.longitude;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 18,
      maxZoom: 19,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Tile Layer
    const tileUrl = mapType === 'satellite' ? TILE_SATELLITE : TILE_STREET;
    const attribution =
      mapType === 'satellite'
        ? '&copy; Esri, Maxar, Earthstar Geographics'
        : '&copy; OpenStreetMap contributors';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // User Marker
    const userIcon = L.divIcon({
      className: 'custom-qibla-user-pin',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(16, 185, 129, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: #059669; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 10;">
            <div style="width: 7px; height: 7px; border-radius: 50%; background: #ffffff;"></div>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
      icon: userIcon,
    }).addTo(map);
    userMarkerRef.current = marker;

    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #1e293b;">
        <strong style="color: #059669; display: block; margin-bottom: 2px;">📍 Titik Posisi Anda</strong>
        <span>Geser pin ini tepat di atas atap rumah atau mihrab masjid Anda untuk akurasi 100%.</span>
      </div>
    `);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setCurrentCoords({ lat: pos.lat, lng: pos.lng });
      updateQiblaLines(map, pos.lat, pos.lng, smoothedHeadingRef.current);
      if (onUpdateCoordinates) {
        onUpdateCoordinates(pos.lat, pos.lng);
      }
      setInfoMessage(`Koordinat disesuaikan: ${pos.lat.toFixed(6)}°, ${pos.lng.toFixed(6)}°`);
      setTimeout(() => setInfoMessage(null), 4000);
    });

    // Kaaba Marker
    const kaabaIcon = L.divIcon({
      className: 'custom-qibla-kaaba-pin',
      html: `
        <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; background: #020617; border-radius: 12px; border: 2px solid #fbbf24; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
          <span style="font-size: 20px; line-height: 1;">🕋</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });

    const kaabaMarker = L.marker(
      [KAABA_COORDINATES.latitude, KAABA_COORDINATES.longitude],
      { icon: kaabaIcon }
    ).addTo(map);
    kaabaMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; color: #0f172a; line-height: 1.4;">
        <strong style="color: #d97706; display: block; font-size: 13px;">🕋 Ka'bah (Masjidil Haram)</strong>
        <span>Makkah Al-Mukarramah, Arab Saudi</span>
        <div style="margin-top: 4px; font-size: 11px; color: #64748b;">
          Koordinat: 21.4225° N, 39.8262° E
        </div>
      </div>
    `);
    kaabaMarkerRef.current = kaabaMarker;

    // Draw initial Qibla Lines
    updateQiblaLines(map, initialLat, initialLng, 0);

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 4. Update Qibla Lines & Dynamic Heading Beam
  const updateQiblaLines = (map: L.Map, lat: number, lng: number, phoneHeading: number) => {
    if (qiblaLineRef.current) map.removeLayer(qiblaLineRef.current);
    if (rayLineRef.current) map.removeLayer(rayLineRef.current);
    if (headingBeamRef.current) map.removeLayer(headingBeamRef.current);

    const qibla = calculateQibla(lat, lng);
    const bearingRad = (qibla.bearing * Math.PI) / 180;

    // A. Local rooftop guide ray (Fixed True Earth Bearing to Kaaba)
    const distKm = 3.5;
    const latDelta = (distKm / 110.574) * Math.cos(bearingRad);
    const lngDelta =
      (distKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(bearingRad);
    const projectedTarget: [number, number] = [lat + latDelta, lng + lngDelta];

    const rayLine = L.polyline([[lat, lng], projectedTarget], {
      color: '#10b981', // Emerald 500
      weight: 5,
      opacity: 0.95,
      dashArray: '10, 8',
    }).addTo(map);
    rayLineRef.current = rayLine;

    // B. DYNAMIC FLASHLIGHT CONE / HEADING BEAM (Points along phone's live compass direction!)
    const headingRad = (phoneHeading * Math.PI) / 180;
    const coneDist = 0.35; // 350 meters
    const beamAngleSpread = (22 * Math.PI) / 180;
    const p1Rad = headingRad - beamAngleSpread;
    const p2Rad = headingRad + beamAngleSpread;

    const p1Lat = lat + (coneDist / 110.574) * Math.cos(p1Rad);
    const p1Lng = lng + (coneDist / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(p1Rad);
    const p2Lat = lat + (coneDist / 110.574) * Math.cos(p2Rad);
    const p2Lng = lng + (coneDist / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(p2Rad);

    // Check alignment between phone heading and Qibla
    const diff = Math.min(
      Math.abs((qibla.bearing - phoneHeading + 360) % 360),
      360 - Math.abs((qibla.bearing - phoneHeading + 360) % 360)
    );
    const isAligned = diff <= 3.5;

    const headingBeam = L.polygon([[lat, lng], [p1Lat, p1Lng], [p2Lat, p2Lng]], {
      color: isAligned ? '#10b981' : '#0284c7', // Emerald when locked on Qibla, Sky blue when turning
      fillColor: isAligned ? '#10b981' : '#38bdf8',
      fillOpacity: isAligned ? 0.45 : 0.28,
      weight: 2,
      stroke: true,
      dashArray: isAligned ? undefined : '4, 4',
    }).addTo(map);
    headingBeamRef.current = headingBeam;

    // C. Great-Circle line to Ka'bah
    const kaabaCoords: [number, number] = [
      KAABA_COORDINATES.latitude,
      KAABA_COORDINATES.longitude,
    ];
    const fullLine = L.polyline([[lat, lng], kaabaCoords], {
      color: '#fbbf24',
      weight: 3.5,
      opacity: 0.85,
    }).addTo(map);
    qiblaLineRef.current = fullLine;
  };

  // 5. Re-render live beam whenever displayHeading or coordinates change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateQiblaLines(
        mapInstanceRef.current,
        currentCoords.lat,
        currentCoords.lng,
        displayHeading
      );
    }
  }, [displayHeading, currentCoords]);

  // Center on user whenever heading changes in follow mode
  useEffect(() => {
    if (isRotateWithPhone && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([currentCoords.lat, currentCoords.lng], {
        animate: false,
      });
    }
  }, [isRotateWithPhone, currentCoords]);

  // 6. Continuous Live GPS Walking Tracker (watchPosition)
  const toggleLiveGpsWatch = () => {
    if (!navigator.geolocation) {
      setInfoMessage('GPS tidak didukung oleh browser ini.');
      return;
    }

    if (isWatchLiveGps) {
      // Turn off
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsWatchLiveGps(false);
      setInfoMessage('Pelacakan GPS live dimatikan.');
      setTimeout(() => setInfoMessage(null), 3000);
    } else {
      // Turn on
      setIsWatchLiveGps(true);
      setInfoMessage('Pelacakan GPS live aktif! Berjalanlah untuk melihat titik berpindah.');
      setTimeout(() => setInfoMessage(null), 4000);

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          }
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 18, { animate: true });
          }
          if (onUpdateCoordinates) {
            onUpdateCoordinates(latitude, longitude);
          }
        },
        (err) => {
          console.warn('GPS watch error:', err);
          setIsWatchLiveGps(false);
          setInfoMessage(`GPS error: ${err.message}`);
          setTimeout(() => setInfoMessage(null), 4000);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      );
      watchIdRef.current = id;
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Toggle Map Satellite vs Street
  const handleToggleMapType = () => {
    const nextType = mapType === 'satellite' ? 'street' : 'satellite';
    setMapType(nextType);

    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);

      const tileUrl = nextType === 'satellite' ? TILE_SATELLITE : TILE_STREET;
      const attribution =
        nextType === 'satellite'
          ? '&copy; Esri, Maxar, Earthstar Geographics'
          : '&copy; OpenStreetMap contributors';

      const newTile = L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      tileLayerRef.current = newTile;
    }
  };

  // Center on current position
  const handleCenterUser = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng], 18);
    }
  };

  // Full Route to Kaaba
  const handleShowFullRoute = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([
        [currentCoords.lat, currentCoords.lng],
        [KAABA_COORDINATES.latitude, KAABA_COORDINATES.longitude],
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      setInfoMessage(`Menampilkan rute akurat melintasi samudra menuju Ka'bah, Makkah.`);
      setTimeout(() => setInfoMessage(null), 4000);
    }
  };

  // Check alignment
  const diffToQibla = Math.min(
    Math.abs((liveQibla.bearing - displayHeading + 360) % 360),
    360 - Math.abs((liveQibla.bearing - displayHeading + 360) % 360)
  );
  const isAligned = diffToQibla <= 3.5;

  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'h-[560px] sm:h-[640px]'
      } ${className}`}
    >
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col sm:flex-row items-start sm:items-center justify-between pointer-events-none gap-2">
        {/* Live Qibla & Heading Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Compass className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 dark:text-emerald-400">
                Arah Kiblat Geodesik
              </span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  isAligned
                    ? 'bg-emerald-500 text-slate-950 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {isAligned ? '✨ Tepat Kiblat!' : 'Google Style'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                {liveQibla.bearing.toFixed(2)}°
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {liveQibla.directionCardinal}
              </span>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-bold ml-1 font-mono">
                (Hadap HP: {Math.round(displayHeading)}°)
              </span>
            </div>
          </div>
        </div>

        {/* Map Tool Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 flex-wrap">
          {/* Toggle Map Auto-Rotation with Phone Heading */}
          <button
            onClick={() => {
              setIsRotateWithPhone(!isRotateWithPhone);
              setInfoMessage(
                !isRotateWithPhone
                  ? 'Mode Rotasi Aktif: Peta berputar otomatis mengikuti hadap HP!'
                  : 'Mode Utara Tetap: Peta menghadap Utara, sinar senter berputar.'
              );
              setTimeout(() => setInfoMessage(null), 4000);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
              isRotateWithPhone
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/30'
                : 'bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
            title="Nyalakan/matikan perputaran peta otomatis mengikuti gerakan ponsel"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotateWithPhone ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span>{isRotateWithPhone ? 'Peta Berputar (Aktif)' : 'Utara Tetap'}</span>
          </button>

          {/* Toggle Live Walking GPS */}
          <button
            onClick={toggleLiveGpsWatch}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ${
              isWatchLiveGps
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 animate-pulse'
                : 'bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
            }`}
            title="Pelacakan otomatis posisi saat Anda berjalan"
          >
            <Footprints className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isWatchLiveGps ? 'GPS Jalan (Aktif)' : 'Ikuti Jalan'}
            </span>
          </button>

          {/* Switch to AR Camera */}
          {onOpenARMode && (
            <button
              onClick={onOpenARMode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-md text-xs font-bold transition-all cursor-pointer"
              title="Buka Kamera AR Google Qibla Finder"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Kamera AR</span>
            </button>
          )}

          {/* Toggle Satellite / Street */}
          <button
            onClick={handleToggleMapType}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
            title="Ganti ke Tampilan Satelit / Peta Jalan"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">
              {mapType === 'satellite' ? 'Satelit' : 'Jalanan'}
            </span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md text-slate-700 dark:text-slate-200 cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Sensor Permission Reminder if needed */}
      {!hasCompassSensor && (
        <div className="absolute top-18 left-3 right-3 z-[400] flex items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-500/95 text-slate-950 font-bold text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Gerakkan ponsel Anda atau aktifkan sensor kompas untuk memutar peta secara otomatis.</span>
          </div>
          <button
            onClick={requestSensorPermission}
            className="px-3 py-1 rounded-lg bg-slate-950 text-white text-[11px] font-bold hover:bg-slate-800 cursor-pointer shrink-0"
          >
            Aktifkan Sensor
          </button>
        </div>
      )}

      {/* Info Notification Toast */}
      {infoMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 rounded-xl bg-slate-900/95 text-white border border-emerald-500/40 text-xs font-semibold backdrop-blur-md shadow-lg animate-in fade-in flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* 4. DYNAMIC ROTATING MAP VIEWPORT */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Forward Axis Guide Indicator (Points Straight Forward on Phone) */}
        {isRotateWithPhone && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[350] pointer-events-none flex flex-col items-center">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-emerald-400 drop-shadow-md animate-bounce" />
            <span className="text-[10px] font-black text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 tracking-wider uppercase mt-1">
              Arah Depan HP
            </span>
          </div>
        )}

        {/* Floating Rotating Compass Rose (Shows where North is) */}
        <div
          className="absolute top-16 right-4 z-[350] p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 shadow-xl pointer-events-auto cursor-pointer"
          onClick={() => {
            setDisplayHeading(0);
            setManualHeadingSimulation(0);
            setIsRotateWithPhone(false);
          }}
          title="Klik untuk reset menghadap Utara"
        >
          <div
            className="w-10 h-10 flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `rotate(${isRotateWithPhone ? -displayHeading : 0}deg)`,
            }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-rose-500">N</span>
              <div className="w-[2px] h-4 bg-gradient-to-b from-rose-500 via-white to-slate-400" />
              <span className="text-[10px] font-bold text-slate-400">S</span>
            </div>
          </div>
        </div>

        {/* Rotating Leaflet Wrapper */}
        <div
          className="w-full h-full transition-transform duration-75 ease-out"
          style={{
            transform: isRotateWithPhone ? `rotate(${-displayHeading}deg)` : 'none',
            transformOrigin: 'center center',
            width: isRotateWithPhone ? '140%' : '100%',
            height: isRotateWithPhone ? '140%' : '100%',
            marginLeft: isRotateWithPhone ? '-20%' : '0',
            marginTop: isRotateWithPhone ? '-20%' : '0',
          }}
        >
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
      </div>

      {/* 5. SLIDER SIMULATION (When testing on PC/Laptop without gyroscope) */}
      {(!hasCompassSensor || useSimulation) && (
        <div className="absolute bottom-20 left-4 right-4 z-[400] bg-slate-950/90 p-2.5 rounded-2xl border border-slate-700 backdrop-blur-md shadow-xl flex items-center gap-3">
          <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            type="range"
            min={0}
            max={359}
            value={manualHeadingSimulation}
            onChange={(e) => {
              setManualHeadingSimulation(Number(e.target.value));
              if (!useSimulation) setUseSimulation(true);
            }}
            className="w-full accent-amber-400 cursor-pointer"
            title="Geser untuk memutar arah hadap HP secara manual"
          />
          <span className="text-xs font-mono font-bold text-white shrink-0">
            {manualHeadingSimulation}°
          </span>
          <button
            onClick={() => setManualHeadingSimulation(Math.round(liveQibla.bearing))}
            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white shrink-0"
          >
            Putar ke Kiblat
          </button>
        </div>
      )}

      {/* 6. BOTTOM GUIDANCE & ACTIONS BAR */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        {/* Dynamic Instructional Banner */}
        <div className="pointer-events-auto p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg max-w-lg space-y-1 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-extrabold uppercase tracking-wide text-[11px]">
            <Building className="w-3.5 h-3.5" />
            <span>Peta Mengikuti Pergerakan HP:</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isRotateWithPhone ? (
              <>
                Peta berputar <strong>360° secara otomatis</strong> saat Anda memutar ponsel. Putar tubuh Anda hingga garis hijau Ka'bah tepat tegak lurus ke atas layar!
              </>
            ) : (
              <>
                Sinar senter biru/hijau di atas pin berputar mengikuti hadap HP Anda secara real-time.
              </>
            )}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleCenterUser}
            className="p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-lg cursor-pointer"
            title="Kembali ke Titik Saya"
          >
            <Navigation className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={handleShowFullRoute}
            className="px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Lihat seluruh rute samudra ke Makkah"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>Rute Makkah</span>
          </button>

          <a
            href="https://qiblafinder.withgoogle.com/intl/id/finder/ar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-white border border-white/20 shadow-lg text-xs font-bold transition-all"
            title="Buka Website Asli Google Qibla Finder"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Google Asli</span>
          </a>
        </div>
      </div>
    </div>
  );
};
