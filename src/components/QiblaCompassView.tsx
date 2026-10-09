import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Info,
  RotateCw,
  CheckCircle,
  CheckCircle2,
  Sliders,
  LocateFixed,
  Sun,
  Map as MapIcon,
  HelpCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Activity,
  Gauge,
  Zap,
  Crosshair,
  Smartphone,
  Check,
  ShieldCheck,
  Signal,
  RotateCcw,
  Radio,
  X,
  Camera,
} from 'lucide-react';
import { LocationConfig } from '../types';
import { calculateQibla, calculateSolarAzimuth, KAABA_COORDINATES } from '../utils/prayerTimesTarjih';
import { DigitalQiblaMap } from './DigitalQiblaMap';
import { GoogleQiblaARFinder } from './GoogleQiblaARFinder';

export type CompassAccuracyLevel = 'high' | 'medium' | 'low' | 'uncalibrated';

export interface CompassAccuracyData {
  level: CompassAccuracyLevel;
  toleranceDeg: number;
  label: string;
  source: string;
  isInterfered: boolean;
  scorePercent: number; // 0 - 100
  accuracyRaw: number | null;
}

interface QiblaCompassViewProps {
  location: LocationConfig;
  onOpenLocationModal: () => void;
  onUpdateLocation?: (loc: LocationConfig) => void;
  onClose?: () => void;
}

/**
 * Calculates 3D tilt-compensated compass heading from DeviceOrientation Euler angles (alpha, beta, gamma)
 * or hardware-calibrated webkitCompassHeading (iOS).
 */
function computeTiltCompensatedHeading(
  alpha: number,
  beta: number,
  gamma: number,
  iosCompassHeading?: number
): number {
  // 1. iOS hardware calibrated geomagnetic compass heading (CoreMotion hardware fusion)
  if (typeof iosCompassHeading === 'number' && !isNaN(iosCompassHeading)) {
    return (iosCompassHeading + 360) % 360;
  }

  // 2. Android / W3C DeviceOrientation (alpha: yaw [0, 360), beta: pitch [-180, 180], gamma: roll [-90, 90])
  const degToRad = Math.PI / 180;
  const _a = (alpha || 0) * degToRad;
  const _b = (beta || 0) * degToRad;
  const _g = (gamma || 0) * degToRad;

  const cA = Math.cos(_a);
  const sA = Math.sin(_a);
  const cB = Math.cos(_b);
  const sB = Math.sin(_b);
  const cG = Math.cos(_g);
  const sG = Math.sin(_g);

  // When device is held nearly flat on table/hand (pitch < 18° & roll < 18°),
  // clockwise azimuth from North is directly (360 - alpha) % 360:
  if (Math.abs(beta) < 18 && Math.abs(gamma) < 18) {
    return (360 - alpha + 360) % 360;
  }

  // Full 3D Euler tilt compensation:
  // Forward vector of the phone (along +Y screen axis) projected onto the horizontal Earth plane:
  const vX = -cA * sG - sA * sB * cG;
  const vY = -sA * sG + cA * sB * cG;

  if (Math.hypot(vX, vY) > 0.05) {
    let deg = Math.atan2(-vX, vY) * (180 / Math.PI);
    return (deg + 360) % 360;
  }

  return (360 - alpha + 360) % 360;
}

export const QiblaCompassView: React.FC<QiblaCompassViewProps> = ({
  location,
  onOpenLocationModal,
  onUpdateLocation,
  onClose,
}) => {
  const qiblaInfo = calculateQibla(location.latitude, location.longitude);

  // Active view tab: 'ar' (Google Qibla Finder AR Camera) | 'map' (Peta Satelit Digital) | 'compass' | 'sun'
  const [activeTab, setActiveTab] = useState<'ar' | 'map' | 'compass' | 'sun'>('ar');

  // Physical Sensor States (Magnetometer + Gyroscope)
  const [heading, setHeading] = useState<number>(0);
  const [rawHeading, setRawHeading] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0); // beta (kemiringan depan-belakang)
  const [roll, setRoll] = useState<number>(0); // gamma (kemiringan kiri-kanan)
  const [gyroSpeed, setGyroSpeed] = useState<number>(0); // angular velocity from gyroscope in deg/s

  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [hasGyroSensor, setHasGyroSensor] = useState<boolean>(false);
  const [isAbsolute, setIsAbsolute] = useState<boolean>(false);
  const [sensorType, setSensorType] = useState<string>('Mendeteksi...');
  const [sensorRateHz, setSensorRateHz] = useState<number>(0);

  const [manualHeading, setManualHeading] = useState<number>(0);
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  // Refs for high-performance physics calculation without stale closure
  const headingRef = useRef<number>(0);
  const gyroSpeedRef = useRef<number>(0);
  const eventCounterRef = useRef<number>(0);
  const lastHzCheckRef = useRef<number>(performance.now());
  const hasVibratedRef = useRef<boolean>(false);

  // Calibration & Magnetic Declination
  // In Indonesia, magnetic declination is typically +0.5° to +2.5° East
  const approxDeclination = useMemo(() => {
    // Approximate formula for Indonesia based on longitude
    const dec = 0.8 + (location.longitude - 106.8) * 0.08;
    return Number(dec.toFixed(1));
  }, [location.longitude]);

  const [useDeclination, setUseDeclination] = useState<boolean>(true);
  const [calibrationOffset, setCalibrationOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tarjih_qibla_offset');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // GPS detection state (for coordinate fixing)
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Show calibration modal
  const [showCalibrationHelp, setShowCalibrationHelp] = useState<boolean>(false);

  // Real-time Compass Accuracy State (from DeviceOrientationEvent API)
  const [compassAccuracy, setCompassAccuracy] = useState<CompassAccuracyData>({
    level: 'medium',
    toleranceDeg: 8,
    label: 'Akurasi Normal',
    source: 'Orientasi Fusi',
    isInterfered: false,
    scorePercent: 75,
    accuracyRaw: null,
  });

  // Interactive Figure-8 calibration states
  const [calibrationTab, setCalibrationTab] = useState<'interactive' | 'guide'>('interactive');
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);
  const [calibrationAxes, setCalibrationAxes] = useState<{ pitch: boolean; roll: boolean; yaw: boolean }>({
    pitch: false,
    roll: false,
    yaw: false,
  });
  const [calibrationComplete, setCalibrationComplete] = useState<boolean>(false);

  // Refs for tracking coverage during calibration & detecting magnetic fluctuations
  const calibMinPitchRef = useRef<number>(999);
  const calibMaxPitchRef = useRef<number>(-999);
  const calibMinRollRef = useRef<number>(999);
  const calibMaxRollRef = useRef<number>(-999);
  const calibPrevAlphaRef = useRef<number | null>(null);
  const calibSweptAlphaRef = useRef<number>(0);
  const recentRawHeadingsRef = useRef<number[]>([]);
  const lastCalibratedTimeRef = useRef<number | null>(null);
  const showCalibrationHelpRef = useRef<boolean>(false);

  useEffect(() => {
    showCalibrationHelpRef.current = showCalibrationHelp;
  }, [showCalibrationHelp]);

  const resetInteractiveCalibration = useCallback(() => {
    calibMinPitchRef.current = 999;
    calibMaxPitchRef.current = -999;
    calibMinRollRef.current = 999;
    calibMaxRollRef.current = -999;
    calibPrevAlphaRef.current = null;
    calibSweptAlphaRef.current = 0;
    setCalibrationProgress(0);
    setCalibrationComplete(false);
    setCalibrationAxes({ pitch: false, roll: false, yaw: false });
  }, []);

  // Solar position
  const [solarPos, setSolarPos] = useState(() =>
    calculateSolarAzimuth(new Date(), location.latitude, location.longitude, location.timezone)
  );

  // Update solar position every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSolarPos(
        calculateSolarAzimuth(new Date(), location.latitude, location.longitude, location.timezone)
      );
    }, 10000);
    return () => clearInterval(timer);
  }, [location]);

  // Save calibration offset to localStorage
  const handleOffsetChange = (val: number) => {
    setCalibrationOffset(val);
    try {
      localStorage.setItem('tarjih_qibla_offset', String(val));
    } catch {
      // ignore
    }
  };

  /**
   * Device Orientation & Gyroscope Fusion Sensor Engine:
   * 1. Magnetometer Channel (DeviceOrientation / DeviceOrientationAbsolute / webkitCompassHeading)
   * 2. Gyroscope Channel (DeviceMotion rotationRate)
   * 3. Complementary Dynamic Adaptive Filter:
   *    - High responsiveness when turning physically (weight 0.85)
   *    - Rock-solid stability with deadband when stationary (weight 0.08)
   */
  const setupSensors = useCallback(() => {
    // 1. Gyroscope Motion Listener (Angular Rate)
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (e.rotationRate) {
        const rAlpha = Math.abs(e.rotationRate.alpha || 0); // Yaw rate (Z)
        const rBeta = Math.abs(e.rotationRate.beta || 0); // Pitch rate (X)
        const rGamma = Math.abs(e.rotationRate.gamma || 0); // Roll rate (Y)

        const totalRotSpeed = Math.hypot(rAlpha, rBeta, rGamma);
        gyroSpeedRef.current = totalRotSpeed;
        setGyroSpeed(Math.round(totalRotSpeed));
        setHasGyroSensor(true);
      }
    };

    // 2. Orientation Listener (Magnetometer / Accelerometer Fusion)
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // Frequency counter (Hz)
      eventCounterRef.current++;
      const now = performance.now();
      if (now - lastHzCheckRef.current >= 1000) {
        setSensorRateHz(eventCounterRef.current);
        eventCounterRef.current = 0;
        lastHzCheckRef.current = now;
      }

      const iosEvent = e as unknown as {
        webkitCompassHeading?: number;
        webkitCompassAccuracy?: number;
      };

      const hasIosHeading =
        typeof iosEvent.webkitCompassHeading === 'number' &&
        !isNaN(iosEvent.webkitCompassHeading);

      const iosAccuracy =
        typeof iosEvent.webkitCompassAccuracy === 'number' &&
        !isNaN(iosEvent.webkitCompassAccuracy)
          ? iosEvent.webkitCompassAccuracy
          : null;

      const alpha = e.alpha ?? 0;
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;

      setPitch(Math.round(beta));
      setRoll(Math.round(gamma));

      // Calculate 3D tilt-compensated instantaneous raw compass heading
      const raw = computeTiltCompensatedHeading(
        alpha,
        beta,
        gamma,
        hasIosHeading ? iosEvent.webkitCompassHeading : undefined
      );

      setRawHeading(Math.round(raw));
      setHasCompassSensor(true);

      if (hasIosHeading) {
        setSensorType('iOS Geomagnetik Hardware (CoreMotion)');
        setIsAbsolute(true);
      } else if (e.absolute) {
        setSensorType('Android Magnetometer Absolut (Geomagnetik)');
        setIsAbsolute(true);
      } else {
        setSensorType('Sensor Orientasi & Giroskop Fisik');
        setIsAbsolute(false);
      }

      // Detect electromagnetic interference & jitter when stationary
      recentRawHeadingsRef.current.push(raw);
      if (recentRawHeadingsRef.current.length > 15) {
        recentRawHeadingsRef.current.shift();
      }

      let isMagneticInterfered = false;
      const currentSpeed = gyroSpeedRef.current;
      if (currentSpeed < 2 && recentRawHeadingsRef.current.length >= 8) {
        const list = recentRawHeadingsRef.current;
        const avg = list.reduce((a, b) => a + b, 0) / list.length;
        const variance =
          list.reduce((sum, h) => sum + Math.pow((h - avg + 540) % 360 - 180, 2), 0) /
          list.length;
        if (variance > 16) {
          isMagneticInterfered = true;
        }
      }

      // Compute Real-time Compass Accuracy Metric:
      const isRecentlyCalibrated =
        lastCalibratedTimeRef.current !== null &&
        Date.now() - lastCalibratedTimeRef.current < 15 * 60 * 1000;

      let accLevel: CompassAccuracyLevel = 'medium';
      let accTolerance = 8;
      let accLabel = 'Akurasi Normal';
      const accSource = hasIosHeading
        ? 'iOS CoreMotion'
        : e.absolute
        ? 'Magnetometer Absolut'
        : 'Orientasi Fusi';

      if (iosAccuracy !== null) {
        // Native iOS webkitCompassAccuracy in degrees
        if (iosAccuracy < 0) {
          accLevel = 'uncalibrated';
          accTolerance = 30;
          accLabel = 'Perlu Kalibrasi Angka 8';
        } else if (iosAccuracy <= 10) {
          accLevel = 'high';
          accTolerance = Math.max(1, Math.round(iosAccuracy));
          accLabel = `Tinggi (±${accTolerance}°)`;
        } else if (iosAccuracy <= 22) {
          accLevel = 'medium';
          accTolerance = Math.round(iosAccuracy);
          accLabel = `Sedang (±${accTolerance}°)`;
        } else {
          accLevel = 'low';
          accTolerance = Math.round(iosAccuracy);
          accLabel = `Rendah (±${accTolerance}°)`;
        }
      } else {
        // Android & standard W3C DeviceOrientation:
        let baseTol = isRecentlyCalibrated ? 3 : e.absolute ? 5 : 12;
        const tiltDeg = Math.hypot(beta, gamma);
        if (tiltDeg > 20) {
          baseTol += Math.min(10, Math.round((tiltDeg - 20) * 0.4));
        }
        if (isMagneticInterfered) {
          baseTol += 15;
        }

        accTolerance = baseTol;
        if (isMagneticInterfered) {
          accLevel = 'low';
          accLabel = 'Distorsi Magnet (Perlu Kalibrasi)';
        } else if (accTolerance <= 6) {
          accLevel = 'high';
          accLabel = `Tinggi (±${accTolerance}°)`;
        } else if (accTolerance <= 16) {
          accLevel = 'medium';
          accLabel = `Sedang (±${accTolerance}°)`;
        } else {
          accLevel = 'low';
          accLabel = `Rendah (±${accTolerance}°)`;
        }
      }

      const scorePct = Math.max(
        15,
        Math.min(100, Math.round(100 - (accTolerance / 35) * 85))
      );

      setCompassAccuracy({
        level: accLevel,
        toleranceDeg: accTolerance,
        label: accLabel,
        source: accSource,
        isInterfered: isMagneticInterfered,
        scorePercent: scorePct,
        accuracyRaw: iosAccuracy,
      });

      // Real-time Figure-8 interactive motion tracker:
      if (showCalibrationHelpRef.current) {
        if (calibMinPitchRef.current === 999 || beta < calibMinPitchRef.current) calibMinPitchRef.current = beta;
        if (calibMaxPitchRef.current === -999 || beta > calibMaxPitchRef.current) calibMaxPitchRef.current = beta;
        if (calibMinRollRef.current === 999 || gamma < calibMinRollRef.current) calibMinRollRef.current = gamma;
        if (calibMaxRollRef.current === -999 || gamma > calibMaxRollRef.current) calibMaxRollRef.current = gamma;

        if (calibPrevAlphaRef.current !== null) {
          const dAlpha = Math.abs((alpha - calibPrevAlphaRef.current + 540) % 360 - 180);
          if (dAlpha < 45) {
            calibSweptAlphaRef.current += dAlpha;
          }
        }
        calibPrevAlphaRef.current = alpha;

        const pitchRange = calibMaxPitchRef.current - calibMinPitchRef.current;
        const rollRange = calibMaxRollRef.current - calibMinRollRef.current;
        const yawSwept = calibSweptAlphaRef.current;

        const pitchOk = pitchRange >= 32;
        const rollOk = rollRange >= 32;
        const yawOk = yawSwept >= 160;

        setCalibrationAxes({ pitch: pitchOk, roll: rollOk, yaw: yawOk });

        const pScore = Math.min(1, pitchRange / 32);
        const rScore = Math.min(1, rollRange / 32);
        const yScore = Math.min(1, yawSwept / 160);

        const totalProg = Math.min(
          100,
          Math.round((pScore * 0.35 + rScore * 0.35 + yScore * 0.3) * 100)
        );
        setCalibrationProgress(totalProg);

        if (totalProg >= 100) {
          setCalibrationComplete(true);
          if (!lastCalibratedTimeRef.current || Date.now() - lastCalibratedTimeRef.current > 3000) {
            lastCalibratedTimeRef.current = Date.now();
            try {
              if ('vibrate' in navigator) {
                navigator.vibrate([100, 60, 140]);
              }
            } catch {
              // ignore
            }
          }
        }
      }

      // Dynamic Adaptive Circular Smoothing (Complementary Filter with Gyroscope):
      const prev = headingRef.current;
      const diff = (raw - prev + 540) % 360 - 180;
      const absDiff = Math.abs(diff);

      let filterWeight: number;
      if (absDiff > 30 || currentSpeed > 35) {
        // Fast physical device turn: immediate response, zero lag
        filterWeight = 0.85;
      } else if (absDiff > 10 || currentSpeed > 15) {
        // Moderate turning: swift smooth tracking
        filterWeight = 0.55;
      } else if (absDiff > 2.5 || currentSpeed > 4) {
        // Slow pan: smooth transition
        filterWeight = 0.28;
      } else if (absDiff < 0.25 && currentSpeed < 1.5) {
        // Deadband: virtually zero movement, keep needle rock-solid
        filterWeight = 0;
      } else {
        // Micro-jitter dampening: steady needle
        filterWeight = 0.08;
      }

      const smoothed = (prev + diff * filterWeight + 360) % 360;
      headingRef.current = smoothed;
      setHeading(smoothed);
    };

    // Attach listeners
    const win = window as unknown as {
      ondeviceorientationabsolute?: unknown;
    };

    // Listen to absolute orientation if available
    let usedAbsolute = false;
    if ('ondeviceorientationabsolute' in win) {
      window.addEventListener('deviceorientationabsolute', handleDeviceOrientation as EventListener, true);
      usedAbsolute = true;
    }
    // Also listen to standard deviceorientation (handles iOS webkitCompassHeading & Android fallback)
    window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener, true);

    // Listen to devicemotion for Gyroscope rotational velocity
    window.addEventListener('devicemotion', handleDeviceMotion as EventListener, true);

    return () => {
      if (usedAbsolute) {
        window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation as EventListener, true);
      }
      window.removeEventListener('deviceorientation', handleDeviceOrientation as EventListener, true);
      window.removeEventListener('devicemotion', handleDeviceMotion as EventListener, true);
    };
  }, []);

  // Initialize sensors on mount
  useEffect(() => {
    const cleanup = setupSensors();
    return () => {
      cleanup();
    };
  }, [setupSensors]);

  // Request Sensor Permission (Required on iOS 13+ / iPadOS)
  const requestSensorPermission = async () => {
    setPermissionRequested(true);
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    const DeviceMotion = window.DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    let granted = false;

    // iOS Orientation permission
    if (typeof DeviceOrientation?.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission();
        if (response === 'granted') {
          granted = true;
        }
      } catch (err) {
        console.warn('Orientation permission error:', err);
      }
    } else {
      granted = true;
    }

    // iOS Motion / Gyroscope permission
    if (typeof DeviceMotion?.requestPermission === 'function') {
      try {
        await DeviceMotion.requestPermission();
      } catch {
        // ignore
      }
    }

    setPermissionGranted(granted);
    if (granted) {
      setupSensors();
    }
  };

  // High Accuracy GPS Trigger (only for fixing Earth latitude/longitude)
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung geolokasi GPS.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGpsAccuracy(Math.round(pos.coords.accuracy));

        if (onUpdateLocation) {
          onUpdateLocation({
            name: `GPS (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
            latitude: lat,
            longitude: lng,
            timezone: location.timezone,
            isGps: true,
          });
        }
      },
      (err) => {
        setIsLocating(false);
        setGpsError(err.message || 'Gagal mendapatkan sinyal GPS akurat.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Calculate Effective Heading taking into account Declination and Manual Calibration Offset
  const baseHeading = hasCompassSensor ? heading : manualHeading;
  const declinationOffset = useDeclination ? approxDeclination : 0;
  // Total corrected heading:
  const correctedHeading = (baseHeading + declinationOffset + calibrationOffset + 360) % 360;

  // Qibla angle relative to the phone's top (0° means pointing directly to Ka'bah)
  const relativeQiblaAngle = (qiblaInfo.bearing - correctedHeading + 360) % 360;

  // Angular difference to Qibla (how many degrees off)
  const diffToQibla = Math.min(relativeQiblaAngle, 360 - relativeQiblaAngle);
  const isAligned = diffToQibla <= 2.5;

  // Level status (Phone flat check for maximum magnetic sensor accuracy)
  const isFlat = Math.abs(pitch) < 15 && Math.abs(roll) < 15;

  // Trigger haptic feedback when entering aligned state
  useEffect(() => {
    if (isAligned && !hasVibratedRef.current) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([70, 40, 70]);
        } catch {
          // ignore
        }
      }
      hasVibratedRef.current = true;
    } else if (!isAligned) {
      hasVibratedRef.current = false;
    }
  }, [isAligned]);

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Info & Location Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Arah Kiblat Akurat (Geodesic Great-Circle)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
            {qiblaInfo.bearing}° {qiblaInfo.directionCardinal.split(' ')[0]} (Menghadap Ka'bah)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Lokasi:</span>
            <strong className="text-slate-700 dark:text-slate-200">{location.name}</strong>
            <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
            </span>
            {gpsAccuracy !== null && (
              <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                (GPS: ±{gpsAccuracy}m)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* 1-Tap High Accuracy GPS Button */}
          <button
            onClick={handleDetectGps}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Dapatkan koordinat GPS lintang dan bujur akurat dari satelit HP Anda"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Mencari GPS...' : 'GPS Akurat'}</span>
          </button>

          <button
            onClick={onOpenLocationModal}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Pilih Kota
          </button>

          {/* Prominent Close Sub-Tab Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Tutup penunjuk arah kiblat dan kembali"
            >
              <X className="w-3.5 h-3.5" />
              <span>Tutup Arah Kiblat</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 lg:grid-cols-4 gap-1.5 shadow-2xs">
        <button
          onClick={() => setActiveTab('ar')}
          className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'ar'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Camera className="w-4 h-4 text-amber-300" />
          <span>Kamera AR (Google)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-400 text-slate-950 hidden sm:inline">
            Finder AR
          </span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'map'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <MapIcon className="w-4 h-4 text-emerald-400" />
          <span>Peta Satelit Digital</span>
        </button>
        <button
          onClick={() => setActiveTab('compass')}
          className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'compass'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Kompas Sensor HP</span>
        </button>
        <button
          onClick={() => setActiveTab('sun')}
          className={`py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'sun'
              ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Bayangan Matahari</span>
        </button>
      </div>

      {/* GPS Error Alert if any */}
      {gpsError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{gpsError} (Pastikan izin lokasi browser aktif).</span>
        </div>
      )}

      {/* TAB 0: GOOGLE QIBLA FINDER AR CAMERA */}
      {activeTab === 'ar' && (
        <div className="space-y-4">
          <GoogleQiblaARFinder
            location={location}
            onOpenMapMode={() => setActiveTab('map')}
            onOpenLocationModal={onOpenLocationModal}
            onClose={onClose}
          />
        </div>
      )}

      {/* TAB 1: SENSOR COMPASS DISPLAY */}
      {activeTab === 'compass' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-2xl text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Top Lubber Line Indicator (Arah Hadap Bagian Atas Ponsel) */}
            <div className="flex flex-col items-center mb-3">
              <div className="w-1 h-3 bg-emerald-400 rounded-full mb-1 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Arah Hadap Ponsel: <strong className="text-white font-mono">{Math.round(correctedHeading)}°</strong>
              </span>
            </div>

            {/* Alignment Status Banner */}
            <div
              className={`mb-5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md ${
                isAligned
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/40 animate-bounce'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700'
              }`}
            >
              {isAligned ? (
                <>
                  <CheckCircle className="w-4 h-4 text-slate-950 fill-current" />
                  <span>ALHAMDULILLAH! TEPAT MENGHADAP KIBLAT ({qiblaInfo.bearing}°)</span>
                </>
              ) : (
                <>
                  <Navigation
                    className="w-4 h-4 text-emerald-400 transition-transform"
                    style={{ transform: `rotate(${relativeQiblaAngle}deg)` }}
                  />
                  <span>
                    Putar HP {relativeQiblaAngle > 180 ? `${Math.round(360 - relativeQiblaAngle)}° ke Kiri` : `${Math.round(relativeQiblaAngle)}° ke Kanan`} menuju Kiblat
                  </span>
                </>
              )}
            </div>

            {/* Compass Dial Stage */}
            <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center my-2">
              {/* FIXED Center Lubber Line (Garis bidik lurus ke depan) */}
              <div className="absolute top-0 w-0.5 h-6 bg-emerald-400 z-20 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />

              {/* Rotating Compass Dial Ring:
                  Rotates by -correctedHeading so that True North (U) always points to Earth's physical North! */}
              <div
                className="absolute inset-0 rounded-full border-4 border-slate-700 shadow-2xl flex items-center justify-center transition-transform duration-200 ease-out bg-slate-900/60 backdrop-blur-xs"
                style={{ transform: `rotate(${-correctedHeading}deg)` }}
              >
                {/* Cardinal Marks */}
                <span className="absolute top-2 text-rose-500 font-extrabold text-sm tracking-widest">U</span>
                <span className="absolute right-3 text-slate-400 font-bold text-xs">T</span>
                <span className="absolute bottom-2 text-slate-400 font-bold text-xs">S</span>
                <span className="absolute left-3 text-slate-400 font-bold text-xs">B</span>

                {/* Degree markings (every 15° & 30°) */}
                {[...Array(24)].map((_, i) => {
                  const deg = i * 15;
                  const isCardinal = deg % 90 === 0;
                  const isMajor = deg % 30 === 0;
                  return (
                    <div
                      key={deg}
                      className="absolute w-full h-full flex justify-center pointer-events-none"
                      style={{ transform: `rotate(${deg}deg)` }}
                    >
                      <div
                        className={`w-0.5 ${
                          isCardinal
                            ? 'h-3.5 bg-slate-300'
                            : isMajor
                            ? 'h-2.5 bg-slate-500'
                            : 'h-1.5 bg-slate-700'
                        }`}
                      />
                    </div>
                  );
                })}

                {/* Fixed Ka'bah 🕋 Marker ON THE DIAL RING at exact Qibla Bearing:
                    Because it is placed at qiblaInfo.bearing inside the rotating dial,
                    it accurately points towards Mecca in physical world coordinates! */}
                <div
                  className="absolute w-full h-full flex justify-center pointer-events-none"
                  style={{ transform: `rotate(${qiblaInfo.bearing}deg)` }}
                >
                  <div className="flex flex-col items-center -mt-3.5">
                    <div
                      className={`px-2 py-0.5 rounded-full border flex items-center gap-1 shadow-lg transition-all ${
                        isAligned
                          ? 'bg-emerald-400 border-white text-slate-950 ring-4 ring-emerald-500/50 scale-110'
                          : 'bg-emerald-600 border-emerald-300 text-white'
                      }`}
                    >
                      <span className="text-xs">🕋</span>
                      <span className="text-[10px] font-extrabold">KIBLAT</span>
                    </div>
                    <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-transparent rounded-full mt-0.5" />
                  </div>
                </div>
              </div>

              {/* Central Green Qibla Needle Pointing to Ka'bah relative to screen */}
              <div
                className="absolute w-full h-full flex items-center justify-center transition-transform duration-200 ease-out pointer-events-none z-10"
                style={{ transform: `rotate(${relativeQiblaAngle}deg)` }}
              >
                <div className="relative w-8 h-48 flex flex-col items-center">
                  {/* Green Arrow Needle pointing to Qibla */}
                  <div
                    className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[65px] transition-all ${
                      isAligned
                        ? 'border-b-emerald-400 filter drop-shadow-[0_0_12px_rgba(52,211,153,1)] scale-105'
                        : 'border-b-emerald-500 filter drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]'
                    }`}
                  />
                  {/* Center Pivot */}
                  <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-lg my-1">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isAligned ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  {/* Tail */}
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[35px] border-t-slate-600 opacity-50" />
                </div>
              </div>

              {/* Center Digital Display */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none z-20 bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-700/80 backdrop-blur-md shadow-lg">
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 tracking-wider">
                  {qiblaInfo.bearing}°
                </span>
                <span className="text-[10px] text-slate-300 font-bold">
                  {diffToQibla <= 2.5 ? 'TEPAT' : `Selisih: ${Math.round(diffToQibla)}°`}
                </span>
              </div>
            </div>

            {/* Digital Bubble Level (Waterpass) & Pitch/Roll Indicator */}
            <div className="mt-2 mb-1 p-2.5 px-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center justify-between gap-3 text-xs w-full max-w-sm">
              <div className="flex items-center gap-2">
                {/* Visual Level Reticle */}
                <div className="relative w-8 h-8 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-2.5 h-2.5 rounded-full border border-emerald-500/50" />
                  </div>
                  {/* Bubble */}
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-100 shadow-xs ${
                      isFlat ? 'bg-emerald-400 shadow-emerald-400/80 scale-110' : 'bg-amber-400'
                    }`}
                    style={{
                      transform: `translate(${Math.max(-10, Math.min(10, roll * 0.5))}px, ${Math.max(
                        -10,
                        Math.min(10, pitch * 0.5)
                      )}px)`,
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={isFlat ? 'text-emerald-400' : 'text-amber-400'}>
                      {isFlat ? 'Ponsel Datar (Waterpass OK)' : 'Ponsel Sedikit Miring'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (P: {pitch}°, R: {roll}°)
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isFlat
                      ? 'Sensor Magnetometer pada akurasi geodesik tertinggi'
                      : 'Pegang HP mendatar agar jarum magnet tidak terdistorsi'}
                  </p>
                </div>
              </div>

              {isFlat ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Smartphone className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              )}
            </div>

            {/* REAL-TIME COMPASS ACCURACY INDICATOR HUD */}
            <div className="mt-2.5 w-full max-w-sm rounded-2xl bg-slate-950/90 border border-slate-800 p-3 shadow-md space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* 3-Bar Signal Strength Meter */}
                  <div className="flex items-end gap-1 h-5 px-1.5 py-0.5 bg-slate-900 rounded-md border border-slate-800 shrink-0" title={`Kekuatan Akurasi: ${compassAccuracy.scorePercent}%`}>
                    <div
                      className={`w-1 rounded-xs transition-all duration-300 ${
                        compassAccuracy.level === 'low' || compassAccuracy.level === 'uncalibrated'
                          ? 'h-2 bg-rose-500 animate-pulse'
                          : 'h-2 bg-emerald-500'
                      }`}
                    />
                    <div
                      className={`w-1 rounded-xs transition-all duration-300 ${
                        compassAccuracy.level === 'high'
                          ? 'h-3.5 bg-emerald-400'
                          : compassAccuracy.level === 'medium'
                          ? 'h-3.5 bg-amber-400'
                          : 'h-3.5 bg-slate-800'
                      }`}
                    />
                    <div
                      className={`w-1 rounded-xs transition-all duration-300 ${
                        compassAccuracy.level === 'high' ? 'h-5 bg-emerald-400' : 'h-5 bg-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Akurasi Kompas:
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          compassAccuracy.level === 'high'
                            ? 'text-emerald-400'
                            : compassAccuracy.level === 'medium'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {compassAccuracy.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Toleransi: ±{compassAccuracy.toleranceDeg}° • {compassAccuracy.source}
                    </span>
                  </div>
                </div>

                {/* Quick Action Button to Open Figure-8 Calibration Guide */}
                <button
                  id="btn-calibrate-compass"
                  onClick={() => {
                    resetInteractiveCalibration();
                    setCalibrationTab('interactive');
                    setShowCalibrationHelp(true);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                    compassAccuracy.level === 'high'
                      ? 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 hover:border-emerald-500/40'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold animate-pulse'
                  }`}
                  title="Buka panduan interaktif kalibrasi gerakan angka 8"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{compassAccuracy.level === 'high' ? 'Kalibrasi Ulang' : 'Kalibrasi Angka 8'}</span>
                </button>
              </div>

              {/* Electromagnetic interference alert if detected */}
              {compassAccuracy.isInterfered && (
                <div className="p-2 rounded-xl bg-rose-950/70 border border-rose-800/80 text-[11px] text-rose-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <strong className="block text-rose-300 font-bold">Terdeteksi Gangguan Magnetik:</strong>
                    <span>Jauhkan ponsel dari casing magnet, laptop, atau meja besi. Klik tombol kalibrasi di atas.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sensor & Motion Diagnostics Bar */}
            <div className="mt-3 flex flex-col items-center gap-2.5 w-full max-w-md">
              <div className="grid grid-cols-3 gap-2 w-full text-[11px]">
                {/* Magnetometer status */}
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[9px] text-slate-400 block font-semibold">Magnetometer</span>
                    <span className="text-white font-medium text-[11px] truncate block">
                      {hasCompassSensor ? (isAbsolute ? 'Geomagnetik' : 'Orientasi') : 'Standby'}
                    </span>
                  </div>
                </div>

                {/* Gyroscope status */}
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <Gauge className={`w-3.5 h-3.5 shrink-0 ${gyroSpeed > 10 ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`} />
                  <div className="overflow-hidden">
                    <span className="text-[9px] text-slate-400 block font-semibold">Giroskop</span>
                    <span className="text-white font-medium text-[11px] truncate block font-mono">
                      {hasGyroSensor ? `${gyroSpeed}°/dtk` : 'Terintegrasi'}
                    </span>
                  </div>
                </div>

                {/* Live Accuracy Metric */}
                <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${compassAccuracy.level === 'high' ? 'text-emerald-400' : compassAccuracy.level === 'medium' ? 'text-amber-400' : 'text-rose-400'}`} />
                  <div className="overflow-hidden">
                    <span className="text-[9px] text-slate-400 block font-semibold">Toleransi</span>
                    <span className={`font-bold text-[11px] truncate block ${compassAccuracy.level === 'high' ? 'text-emerald-400' : compassAccuracy.level === 'medium' ? 'text-amber-400' : 'text-rose-400'}`}>
                      ±{compassAccuracy.toleranceDeg}°
                    </span>
                  </div>
                </div>
              </div>

              {/* Sensor update rate and explanation */}
              <div className="flex items-center justify-between w-full text-[10px] text-slate-400 px-1">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Zap className="w-3 h-3" />
                  {sensorRateHz > 0 ? `${sensorRateHz} Hz Update Rate` : 'Real-time Sensor Fusion'}
                </span>
                <button
                  onClick={() => {
                    resetInteractiveCalibration();
                    setCalibrationTab('interactive');
                    setShowCalibrationHelp(!showCalibrationHelp);
                  }}
                  className="flex items-center gap-1 text-emerald-300 hover:text-white underline cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Panduan Angka 8</span>
                </button>
              </div>

              {/* iOS / Permission Activation Button if needed */}
              {(!hasCompassSensor || permissionGranted === false) && (
                <button
                  onClick={requestSensorPermission}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Aktifkan Sensor Gerak & Magnetometer HP</span>
                </button>
              )}

              {/* Manual Slider if no sensor is present (Desktop testing) */}
              {!hasCompassSensor && (
                <div className="w-full bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Geser Manual Arah Hadap (Simulasi Desktop):</span>
                    <span className="font-mono text-white font-bold">{manualHeading}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={manualHeading}
                    onChange={(e) => setManualHeading(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ADVANCED ACCURACY & CALIBRATION PANEL */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Kalibrasi Presisi & Deklinasi Magnetik
                </h3>
              </div>
              {calibrationOffset !== 0 && (
                <button
                  onClick={() => handleOffsetChange(0)}
                  className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset ke 0°
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Deklinasi Magnetik Switch */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-750 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Koreksi Deklinasi Magnetik ({approxDeclination > 0 ? `+${approxDeclination}°` : `${approxDeclination}°`})
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Menyelaraskan kutub utara magnetik bumi ke Kutub Utara Sejati (True North).
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={useDeclination}
                  onChange={(e) => setUseDeclination(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer shrink-0"
                />
              </div>

              {/* Manual Calibration Offset Slider */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-750 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Fine-Tuning Kalibrasi Manual:
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    {calibrationOffset > 0 ? `+${calibrationOffset}°` : `${calibrationOffset}°`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={calibrationOffset}
                  onChange={(e) => handleOffsetChange(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-15° (Kiri)</span>
                  <span>0° (Default)</span>
                  <span>+15° (Kanan)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE DIGITAL MAP (SATELLITE & STREET) */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>Peta Digital Satelit Arah Kiblat (Akurasi 100%)</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Bebas Gangguan Sensor
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Solusi paling akurat jika sensor magnetik HP Anda tidak presisi atau goyang akibat besi beton di dalam ruangan. Lihat atap rumah atau masjid Anda langsung pada citra satelit, lalu luruskan sajadah sejajar dengan garis hijau menuju Ka'bah ({qiblaInfo.bearing}°).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${KAABA_COORDINATES.latitude},${KAABA_COORDINATES.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {onClose && (
                  <button
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tutup</span>
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Leaflet Digital Map Component */}
            <DigitalQiblaMap
              location={location}
              heading={correctedHeading}
              onOpenARMode={() => setActiveTab('ar')}
              onUpdateCoordinates={(lat, lng) => {
                if (onUpdateLocation) {
                  onUpdateLocation({
                    ...location,
                    latitude: lat,
                    longitude: lng,
                  });
                }
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 3: SOLAR POSITION & RASHDUL QIBLAH */}
      {activeTab === 'sun' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 space-y-5 shadow-sm">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Verifikasi Lewat Bayang-Bayang Matahari (Metode Falak Otentik)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Metode paling akurat tanpa ketergantungan pada sensor kompas magnetik HP.
              </p>
            </div>

            {/* Current Sun Position Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Azimut Matahari Saat Ini:
                </span>
                <p className="text-2xl font-black text-amber-950 dark:text-amber-100 font-mono">
                  {solarPos.azimuth}°
                </p>
                <span className="text-[10px] text-amber-700/80 dark:text-amber-400 block">
                  Ketinggian matahari: {solarPos.elevation}°
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Azimut Kiblat Ka'bah:
                </span>
                <p className="text-2xl font-black text-emerald-950 dark:text-emerald-100 font-mono">
                  {qiblaInfo.bearing}°
                </p>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 block">
                  Selisih: {Math.abs(Math.round(solarPos.azimuth - qiblaInfo.bearing))}° dari matahari
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Status Bayangan:
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {solarPos.elevation > 0 ? 'Matahari di atas ufuk (Bisa dicek)' : 'Malam hari (Matahari di bawah ufuk)'}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  {solarPos.elevation > 0
                    ? `Arah bayangan benda tegak: ${(solarPos.azimuth + 180) % 360}°`
                    : 'Cek saat siang hari'}
                </span>
              </div>
            </div>

            {/* Rashdul Qiblah Global Milad */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-emerald-600" />
                <span>Istiwa A'zam / Rashdul Qiblah Global Tahunan (100% Presisi)</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Dua kali setahun pada tanggal <strong>27–28 Mei (pukul 16:18 WIB)</strong> dan <strong>15–16 Juli (pukul 16:27 WIB)</strong>, matahari melintas tepat di zenit atas Ka'bah di Makkah. Bayangan semua benda tegak lurus di Indonesia pada saat itu mengarah 100% lurus ke kiblat tanpa kompas sama sekali.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER: PANDUAN & KALIBRASI INTERAKTIF SENSOR ANGKA 8 */}
      {showCalibrationHelp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Kalibrasi Kompas Real-Time</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dipandu langsung oleh sensor DeviceOrientation HP
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    compassAccuracy.level === 'high'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : compassAccuracy.level === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  ±{compassAccuracy.toleranceDeg}°
                </span>
                <button
                  onClick={() => setShowCalibrationHelp(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Tutup modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                onClick={() => setCalibrationTab('interactive')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  calibrationTab === 'interactive'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Kalibrasi Langsung (Live)</span>
              </button>
              <button
                onClick={() => setCalibrationTab('guide')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  calibrationTab === 'guide'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Penyebab & Solusi</span>
              </button>
            </div>

            {/* TAB 1: LIVE INTERACTIVE CALIBRATION WIZARD */}
            {calibrationTab === 'interactive' && (
              <div className="space-y-4">
                {/* Figure-8 Interactive Visualizer */}
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 p-4 text-center overflow-hidden">
                  {/* Background grid glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />

                  {/* Figure-8 SVG Animation Loop */}
                  <div className="relative w-48 h-28 mx-auto my-1 flex items-center justify-center">
                    <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="fig8Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>

                      {/* Static Infinity Track */}
                      <path
                        d="M 100,50 C 70,10 25,10 25,50 C 25,90 70,90 100,50 C 130,10 175,10 175,50 C 175,90 130,90 100,50 Z"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />

                      {/* Active Glowing Path that lights up with progress */}
                      <path
                        d="M 100,50 C 70,10 25,10 25,50 C 25,90 70,90 100,50 C 130,10 175,10 175,50 C 175,90 130,90 100,50 Z"
                        fill="none"
                        stroke="url(#fig8Grad)"
                        strokeWidth="5"
                        strokeDasharray="420"
                        strokeDashoffset={420 - (420 * calibrationProgress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />

                      {/* Moving guide dot simulating phone hand movement */}
                      <circle r="6" fill="#34d399" filter="drop-shadow(0 0 8px #34d399)">
                        <animateMotion
                          path="M 100,50 C 70,10 25,10 25,50 C 25,90 70,90 100,50 C 130,10 175,10 175,50 C 175,90 130,90 100,50 Z"
                          dur="3.8s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>

                    {/* Central live progress percentage badge */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black font-mono text-white tracking-tight">
                        {calibrationProgress}%
                      </span>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                        {calibrationComplete ? 'TERKALIBRASI' : 'PROGRESS'}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Motivational Guidance Text */}
                  <div className="mt-2 text-xs">
                    {calibrationComplete ? (
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Kalibrasi Sempurna! Sensor Magnetometer Optimal (±3°)</span>
                      </div>
                    ) : calibrationProgress > 60 ? (
                      <p className="text-amber-300 font-medium">
                        Hebat! Lanjutkan memutar HP melingkar hingga seluruh sumbu terdeteksi...
                      </p>
                    ) : calibrationProgress > 25 ? (
                      <p className="text-sky-300 font-medium">
                        Gerakan terdeteksi! Miringkan ponsel ke depan, belakang, kiri, dan kanan...
                      </p>
                    ) : (
                      <p className="text-slate-300 font-medium">
                        Pegang HP Anda lalu putar membentuk pola angka <strong>8 (∞)</strong> di udara secara perlahan...
                      </p>
                    )}
                  </div>
                </div>

                {/* 3-Axis Detection Checkers */}
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {/* Pitch Axis */}
                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      calibrationAxes.pitch
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">Sumbu X (Pitch)</span>
                      {calibrationAxes.pitch ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <RotateCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">Maju - Mundur</span>
                  </div>

                  {/* Roll Axis */}
                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      calibrationAxes.roll
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">Sumbu Y (Roll)</span>
                      {calibrationAxes.roll ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <RotateCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">Miring Kiri - Kanan</span>
                  </div>

                  {/* Yaw Axis */}
                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      calibrationAxes.yaw
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">Sumbu Z (Yaw)</span>
                      {calibrationAxes.yaw ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <RotateCw className="w-3.5 h-3.5 text-slate-400 animate-spin" />
                      )}
                    </div>
                    <span className="text-[10px] block opacity-80">Putaran Azimuth</span>
                  </div>
                </div>

                {/* Live Real-time Telemetry Bar */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-750 flex items-center justify-around text-center text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">Pitch (Beta)</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{pitch}°</span>
                  </div>
                  <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">Roll (Gamma)</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{roll}°</span>
                  </div>
                  <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">Giroskop</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{gyroSpeed}°/dtk</span>
                  </div>
                  <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
                  <div>
                    <span className="text-[9px] text-slate-400 block font-semibold">Toleransi</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ±{compassAccuracy.toleranceDeg}°
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={resetInteractiveCalibration}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Kalibrasi</span>
                  </button>

                  <button
                    onClick={() => setShowCalibrationHelp(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{calibrationComplete ? 'Terapkan & Selesai' : 'Selesai'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: GUIDE & DISTORTION MITIGATION */}
            {calibrationTab === 'guide' && (
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">
                    1. Gerakan Memutar Angka 8 (Figure-8):
                  </strong>
                  Pegang HP dan buat gerakan menyerupai lambang tak hingga <strong>(∞)</strong> secara terus-menerus. Ini meratakan medan magnet internal sensor magnetometer terhadap gravitasi bumi.
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                    2. Lepas Casing Bermagnet & Jauhi Logam:
                  </strong>
                  Casing HP berpenutup magnetik, ring kickstand besi, laptop, speaker, atau meja besi dapat membelokkan jarum kompas hingga 30°–90°.
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                    3. Pertahankan Posisi Datar (Waterpass Hijau):
                  </strong>
                  Letakkan ponsel mendatar di telapak tangan atau lantai. Kemiringan ekstrem (&gt; 25°) dapat meningkatkan galat proyeksi kutub magnetik.
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                    4. Alternatif Peta Satelit & Rashdul Qiblah:
                  </strong>
                  Jika berada di gedung bertingkat tinggi dengan konstruksi beton bertulang lebat, beralihlah ke tab <strong>Peta Garis Kiblat</strong> atau gunakan bayangan matahari pada tab <strong>Posisi Matahari</strong>.
                </div>

                <button
                  onClick={() => setShowCalibrationHelp(false)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md mt-2"
                >
                  Saya Mengerti, Kembali ke Kompas
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Bottom Close Button when viewed as sub-view */}
      {onClose && (
        <div className="pt-2 pb-4 flex justify-center">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>Tutup Penunjuk Arah Kiblat (Kembali ke Jadwal Sholat)</span>
          </button>
        </div>
      )}
    </div>
  );
};
