import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  Compass,
  MapPin,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sliders,
  HelpCircle,
  Sparkles,
  Share2,
  Menu,
  X,
  Check,
  Map as MapIcon,
} from 'lucide-react';
import { LocationConfig } from '../types';
import { calculateQibla, KAABA_COORDINATES } from '../utils/prayerTimesTarjih';

interface GoogleQiblaARFinderProps {
  location: LocationConfig;
  onOpenMapMode?: () => void;
  onOpenLocationModal?: () => void;
  onClose?: () => void;
}

/**
 * Play pleasant chime when Qibla is locked (using Web Audio API)
 */
function playQiblaChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonious dual chime: E5 (659.25Hz), G#5 (830.61Hz), B5 (987.77Hz)
    [659.25, 830.61, 987.77].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.95);
    });
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export const GoogleQiblaARFinder: React.FC<GoogleQiblaARFinderProps> = ({
  location,
  onOpenMapMode,
  onOpenLocationModal,
  onClose,
}) => {
  const qiblaInfo = calculateQibla(location.latitude, location.longitude);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera & Video States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'unsupported'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showCalibrationGuide, setShowCalibrationGuide] = useState<boolean>(false);

  // Physical Sensor States
  const [heading, setHeading] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(30); // beta (default held at ~30 deg)
  const [roll, setRoll] = useState<number>(0); // gamma
  const [hasOrientationSensor, setHasOrientationSensor] = useState<boolean>(false);
  const [manualSimulationAngle, setManualSimulationAngle] = useState<number>(0);
  const [useSimulation, setUseSimulation] = useState<boolean>(false);

  // Interactive Dragging on screen for manual test/desktop
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const startAngleRef = useRef<number>(0);

  // Feedback throttling
  const hasVibratedRef = useRef<boolean>(false);
  const lastChimeTimeRef = useRef<number>(0);

  // Smoothed Heading with Low-Pass Filter
  const smoothedHeadingRef = useRef<number>(0);
  const [displayHeading, setDisplayHeading] = useState<number>(0);

  // 1. Initialize and Stop Camera
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setCameraError('Browser ini tidak mendukung akses kamera.');
      return;
    }

    try {
      setCameraState('requesting');
      setCameraError(null);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState('active');
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('Camera error:', error);
      setCameraState('denied');
      setCameraError(
        error.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Silakan izinkan kamera di browser.'
          : 'Kamera tidak dapat diakses saat ini.'
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, []);

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive, startCamera, stopCamera]);

  // 2. Real-time Device Orientation Sensors
  useEffect(() => {
    let sensorTriggered = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      sensorTriggered = true;
      setHasOrientationSensor(true);

      const iosHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      let rawDeg = 0;

      if (typeof iosHeading === 'number' && !isNaN(iosHeading)) {
        rawDeg = (iosHeading + 360) % 360;
      } else if (e.alpha !== null) {
        const a = e.alpha || 0;
        const b = e.beta || 0;
        const g = e.gamma || 0;

        // When held nearly flat
        if (Math.abs(b) < 18 && Math.abs(g) < 18) {
          rawDeg = (360 - a + 360) % 360;
        } else {
          // Tilt compensation (forward vector projection)
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
            rawDeg = (Math.atan2(-vX, vY) * (180 / Math.PI) + 360) % 360;
          } else {
            rawDeg = (360 - a + 360) % 360;
          }
        }
      }

      setHeading(rawDeg);

      // Save pitch (beta) and roll (gamma) for waterpass bubble
      if (e.beta !== null) setPitch(e.beta);
      if (e.gamma !== null) setRoll(e.gamma);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener(
      'deviceorientationabsolute' as unknown as keyof WindowEventMap,
      handleOrientation as EventListener,
      true
    );

    const checkSensorTimeout = setTimeout(() => {
      if (!sensorTriggered) {
        setHasOrientationSensor(false);
      }
    }, 1500);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener(
        'deviceorientationabsolute' as unknown as keyof WindowEventMap,
        handleOrientation as EventListener,
        true
      );
      clearTimeout(checkSensorTimeout);
    };
  }, []);

  // Request iOS permissions
  const requestIOSPermissions = async () => {
    const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DeviceOrientation?.requestPermission === 'function') {
      try {
        const res = await DeviceOrientation.requestPermission();
        if (res === 'granted') {
          setHasOrientationSensor(true);
        }
      } catch (e) {
        console.warn('iOS orientation permission error', e);
      }
    }
    startCamera();
  };

  // Smooth the heading with RAF low-pass filter
  useEffect(() => {
    let animId: number;
    const target = useSimulation || !hasOrientationSensor ? manualSimulationAngle : heading;

    const updateSmooth = () => {
      const current = smoothedHeadingRef.current;
      let diff = target - current;

      // Handle 360° circular wrapping
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      // Interpolation factor (0.2 for silky smooth response without jitter)
      const next = (current + diff * 0.22 + 360) % 360;
      smoothedHeadingRef.current = next;
      setDisplayHeading(next);

      animId = requestAnimationFrame(updateSmooth);
    };

    animId = requestAnimationFrame(updateSmooth);
    return () => cancelAnimationFrame(animId);
  }, [heading, manualSimulationAngle, useSimulation, hasOrientationSensor]);

  // Touch / Mouse drag to simulate rotation
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartXRef.current = clientX;
    startAngleRef.current = manualSimulationAngle;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartXRef.current;
    // 1 pixel = ~0.6 degrees
    const newAngle = (startAngleRef.current - deltaX * 0.6 + 360) % 360;
    setManualSimulationAngle(newAngle);
    if (!useSimulation) setUseSimulation(true);
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // 3. Qibla Alignment Math
  // qiblaInfo.bearing: exact angle from North to Ka'bah (e.g. ~295° in Jakarta, Indonesia)
  // When phone points at heading H, the compass disc rotates by -H.
  // The blue Qibla road sits at angle (qiblaBearing - H).
  const qiblaBearing = qiblaInfo.bearing;
  const deltaFromQibla = (qiblaBearing - displayHeading + 360) % 360;
  const signedDiff = deltaFromQibla > 180 ? deltaFromQibla - 360 : deltaFromQibla;
  const isAligned = Math.abs(signedDiff) <= 3.5; // Within ±3.5 degrees

  // Spirit Level (Waterpass Bubble) Offset Calculation:
  // Target pitch: ~35° (comfortable phone hand tilt when looking at ground / room)
  // Target roll: 0° (phone not tilted left/right)
  const targetPitch = 35;
  const bubbleX = Math.max(-28, Math.min(28, (roll / 25) * 28));
  const bubbleY = Math.max(-28, Math.min(28, -((pitch - targetPitch) / 25) * 28));
  const isBubbleCentered = Math.hypot(bubbleX, bubbleY) <= 8;

  // Haptic and Audio Chime Feedback on Lock
  useEffect(() => {
    if (isAligned) {
      const now = Date.now();
      if (!hasVibratedRef.current) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([100, 60, 140]);
          } catch {
            // ignore
          }
        }
        if (soundEnabled && now - lastChimeTimeRef.current > 2000) {
          playQiblaChime();
          lastChimeTimeRef.current = now;
        }
        hasVibratedRef.current = true;
      }
    } else {
      hasVibratedRef.current = false;
    }
  }, [isAligned, soundEnabled]);

  // Share Qibla info
  const handleShare = async () => {
    const text = `Arah Kiblat dari ${location.name}: ${qiblaInfo.bearing}° (${qiblaInfo.directionCardinal}). Jarak: ~${qiblaInfo.distanceKm.toLocaleString('id-ID')} km ke Ka'bah.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Arah Kiblat Oase-Muslim',
          text,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Info arah kiblat disalin ke clipboard!');
    }
  };

  return (
    <div
      className={`relative w-full bg-slate-950 overflow-hidden select-none transition-all touch-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen'
          : 'rounded-3xl border border-slate-800 shadow-2xl h-[580px] sm:h-[660px]'
      }`}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. REAL-WORLD CAMERA STREAM */}
      {isCameraActive && (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
            cameraState === 'active' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Dark / Room Grid Texture fallback if camera is turned off or blocked */}
      {(!isCameraActive || cameraState !== 'active') && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black pointer-events-none">
          {/* Subtle floor tile grid representing room ground */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg) translateY(120px)',
            }}
          />
        </div>
      )}

      {/* 2. TOP APP BAR (Iconic Google Qibla Finder Header) */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Menu Hamburger */}
        <button
          onClick={() => setShowMenu(true)}
          className="pointer-events-auto p-2.5 rounded-full bg-slate-950/60 backdrop-blur-md text-white hover:bg-slate-900 transition-all cursor-pointer shadow-lg border border-white/10"
          title="Menu & Panduan"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Live Qibla Bearing Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white border border-white/15 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold font-mono tracking-wide">
            Kiblat: {qiblaInfo.bearing}° {qiblaInfo.directionCardinal}
          </span>
        </div>

        {/* Right: Camera Toggle Pill [ ✓ 📷 ] exactly like Google Qibla Finder! */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg border ${
              isCameraActive
                ? 'bg-sky-500/90 text-white border-sky-400 font-bold'
                : 'bg-slate-900/80 text-slate-300 border-white/15'
            }`}
            title="Nyalakan / Matikan Kamera"
          >
            {isCameraActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sensor Activation Prompt if not yet triggered */}
      {!hasOrientationSensor && (
        <div className="absolute top-16 left-3 right-3 z-40 flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-amber-500/95 text-slate-950 font-bold text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 shrink-0" />
            <span>Sentuh untuk mengaktifkan sensor gerak & kompas HP.</span>
          </div>
          <button
            onClick={requestIOSPermissions}
            className="px-3 py-1.5 rounded-xl bg-slate-950 text-white text-[11px] font-bold hover:bg-slate-800 cursor-pointer shrink-0"
          >
            Aktifkan Sensor
          </button>
        </div>
      )}

      {/* 3. MAIN 3D COMPASS & CYAN/BLUE QIBLA ROAD (Exact Google Qibla Finder Replica) */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        {/* 3D Perspective Stage on the Floor */}
        <div
          className="relative flex items-center justify-center"
          style={{
            perspective: '1000px',
            transform: 'translateY(60px)',
          }}
        >
          {/* Tilted Disc Ground Plane */}
          <div
            className="relative flex items-center justify-center"
            style={{
              transform: 'rotateX(52deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* A. BROAD CYAN/BLUE ROAD EXTENDING TOWARDS QIBLA */}
            {/* The road points in the direction of deltaFromQibla! */}
            <div
              className="absolute pointer-events-none flex flex-col items-center origin-bottom transition-transform duration-75 ease-out"
              style={{
                bottom: '50%',
                transform: `rotate(${deltaFromQibla}deg)`,
                width: '120px',
                height: '420px',
              }}
            >
              {/* Blue / Cyan Highway Gradient */}
              <div
                className={`relative w-full h-full flex flex-col items-center justify-start overflow-hidden transition-all duration-300 ${
                  isAligned
                    ? 'bg-gradient-to-t from-emerald-500/80 via-cyan-400/90 to-amber-300/90 shadow-[0_0_60px_rgba(6,182,212,0.8)]'
                    : 'bg-gradient-to-t from-sky-500/75 via-sky-500/60 to-sky-400/20'
                }`}
                style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', // Trapezoid runway perspective
                }}
              >
                {/* Animated Chevrons [ ^ ^ ^ ] moving towards Mecca */}
                <div className="w-full h-full flex flex-col items-center justify-around py-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 flex items-center justify-center transition-all animate-pulse ${
                        isAligned ? 'text-amber-200' : 'text-white/80'
                      }`}
                      style={{ animationDelay: `${idx * 0.25}s` }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 stroke-current stroke-[3]">
                        <path d="M 4 15 L 12 7 L 20 15" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Floating 3D Kaaba Badge at the horizon of the road */}
                <div
                  className={`absolute top-2 transition-all duration-300 flex flex-col items-center ${
                    isAligned ? 'scale-125' : 'scale-90'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border-2 border-amber-400 shadow-xl flex items-center justify-center text-lg">
                    🕋
                  </div>
                  <span className="text-[9px] font-black tracking-tight text-white bg-black/60 px-1.5 py-0.2 rounded-full mt-0.5">
                    Makkah
                  </span>
                </div>
              </div>

              {/* White Triangle Notch at the base of the road touching the dial */}
              <div
                className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[20px] border-b-white -mt-1 shadow-md"
              />
            </div>

            {/* B. THE 3D ROTATING COMPASS DIAL DISC */}
            {/* The dial rotates according to -displayHeading so True North points North */}
            <div
              className={`relative rounded-full transition-transform duration-75 ease-out flex items-center justify-center ${
                isAligned ? 'ring-4 ring-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.7)]' : ''
              }`}
              style={{
                width: '270px',
                height: '270px',
                transform: `rotate(${-displayHeading}deg)`,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '3px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              {/* Translucent Wedge / Sector indicating user's forward view */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(from -30deg at 50% 50%, rgba(255,255,255,0.3) 0deg, rgba(255,255,255,0.3) 60deg, transparent 60deg, transparent 360deg)',
                  transform: `rotate(${displayHeading}deg)`, // Anchored to forward phone axis
                }}
              />

              {/* Cardinal Directions (N, E, S, W) & Compass Dots */}
              {/* North */}
              <div className="absolute top-2 text-white font-black text-sm tracking-widest">
                N
              </div>
              {/* East */}
              <div className="absolute right-3 text-white font-black text-sm tracking-widest">
                E
              </div>
              {/* South */}
              <div className="absolute bottom-2 text-white font-black text-sm tracking-widest">
                S
              </div>
              {/* West */}
              <div className="absolute left-3 text-white font-black text-sm tracking-widest">
                W
              </div>

              {/* Perimeter Compass Dots (every 30 degrees) */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-120px)`,
                  }}
                />
              ))}

              {/* C. SPIRIT LEVEL / WATERPASS RING IN THE CENTER */}
              {/* Central White Target Ring */}
              <div
                className={`relative w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center ${
                  isBubbleCentered
                    ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                    : 'border-white/90 bg-white/10'
                }`}
              >
                {/* The Floating White Bubble */}
                <div
                  className={`w-7 h-7 rounded-full transition-transform duration-75 shadow-md ${
                    isBubbleCentered ? 'bg-emerald-300' : 'bg-white'
                  }`}
                  style={{
                    transform: `translate(${bubbleX}px, ${bubbleY}px)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* D. DYNAMIC GUIDANCE NOTIFICATION BANNER */}
        <div className="absolute top-18 flex flex-col items-center gap-1.5 px-4 text-center">
          {isAligned ? (
            <div className="animate-in zoom-in-95 duration-200 px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2 shadow-[0_0_35px_rgba(16,185,129,0.9)]">
              <Sparkles className="w-5 h-5 text-amber-950" />
              <span>✨ Anda Menghadap Kiblat!</span>
            </div>
          ) : (
            <div className="px-5 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white shadow-xl flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold">
                {signedDiff < 0 ? (
                  <>
                    Putar HP ke kiri{' '}
                    <strong className="text-sky-400 font-mono">
                      {Math.abs(Math.round(signedDiff))}°
                    </strong>
                  </>
                ) : (
                  <>
                    Putar HP ke kanan{' '}
                    <strong className="text-sky-400 font-mono">
                      {Math.abs(Math.round(signedDiff))}°
                    </strong>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Level Guidance text if phone tilted excessively */}
          {!isBubbleCentered && (
            <div className="text-[11px] text-amber-350 bg-black/50 px-3 py-0.5 rounded-full text-slate-250">
              Posisikan gelembung putih di dalam lingkaran tengah
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM BAR: Mini Compass Widget & Quick Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between pointer-events-none">
        {/* Bottom Left: Mini 3D Compass Widget (Identical to Google Qibla Finder) */}
        <div
          onClick={() => {
            if (onOpenMapMode) onOpenMapMode();
          }}
          className="pointer-events-auto p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 shadow-xl cursor-pointer hover:scale-105 transition-all group"
          title="Buka Peta Satelit Digital"
        >
          <div
            className="relative w-14 h-14 rounded-full border border-white/40 flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `rotate(${-displayHeading}deg)`,
            }}
          >
            {/* North Indicator */}
            <span className="absolute top-1 text-[9px] font-black text-white">N</span>
            {/* Mini 3D Cube / Kaaba in the direction of Qibla */}
            <div
              className="absolute origin-center transition-transform duration-75 flex flex-col items-center"
              style={{
                transform: `rotate(${qiblaBearing}deg) translateY(-18px)`,
              }}
            >
              <div className="w-3.5 h-3.5 rounded-xs bg-amber-400 border border-slate-950 flex items-center justify-center text-[8px] shadow-sm">
                🕋
              </div>
            </div>
            {/* Center Pin */}
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>

        {/* Center: Distance Info Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[11px] shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-200">
            ~{qiblaInfo.distanceKm.toLocaleString('id-ID')} km ke Ka'bah
          </span>
        </div>

        {/* Bottom Right: Blue Share / Action Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white hover:bg-slate-900 transition-all cursor-pointer shadow-lg"
            title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Suara Lonceng'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Share Button (Google Style Blue Circle) */}
          <button
            onClick={handleShare}
            className="p-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white transition-all cursor-pointer shadow-xl shadow-sky-600/40 active:scale-95"
            title="Bagikan Arah Kiblat"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 5. SLIDER SIMULATION (When running on PC/laptop without gyro) */}
      {(!hasOrientationSensor || useSimulation) && (
        <div className="absolute top-16 left-4 right-4 z-40 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-700 backdrop-blur-md shadow-xl flex items-center gap-3">
          <Sliders className="w-4 h-4 text-sky-400 shrink-0" />
          <input
            type="range"
            min={0}
            max={359}
            value={manualSimulationAngle}
            onChange={(e) => {
              setManualSimulationAngle(Number(e.target.value));
              if (!useSimulation) setUseSimulation(true);
            }}
            className="w-full accent-sky-400 cursor-pointer"
            title="Geser untuk memutar arah hadap HP secara manual"
          />
          <span className="text-xs font-mono font-bold text-white shrink-0">
            {manualSimulationAngle}°
          </span>
          <button
            onClick={() => setManualSimulationAngle(Math.round(qiblaBearing))}
            className="px-2 py-1 rounded bg-sky-500 hover:bg-sky-400 text-[10px] font-bold text-white shrink-0"
          >
            Kunci Kiblat
          </button>
        </div>
      )}

      {/* 6. SIDE MENU MODAL */}
      {showMenu && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between p-6 text-white animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🕋</span>
              <span className="font-bold text-base">Google Qibla Finder Live</span>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 my-auto max-w-md mx-auto w-full">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-sky-400">Cara Memposisikan HP:</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                1. Pegang ponsel di tangan Anda mengarah ke lantai atau sejajar pandangan mata.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                2. Putar tubuh Anda perlahan mengikuti jalur jalan berwarna <strong>biru/cyan</strong>.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                3. Pastikan gelembung putih berada di dalam lingkaran tengah (*waterpass*) agar posisi sensor optimal.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                4. Saat tanda panah putih sejajar lurus ke depan, Anda telah tepat menghadap Ka'bah!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowCalibrationGuide(true);
                }}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Kalibrasi Sensor</span>
              </button>

              {onOpenMapMode && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenMapMode();
                  }}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Mode Peta Satelit</span>
                </button>
              )}
            </div>

            <a
              href="https://qiblafinder.withgoogle.com/intl/id/finder/ar"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-bold flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-sky-400" />
              <span>Buka Google Qibla Finder Asli</span>
            </a>
          </div>

          <button
            onClick={() => setShowMenu(false)}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-xs"
          >
            Kembali ke Kamera
          </button>
        </div>
      )}

      {/* 7. CALIBRATION GUIDANCE MODAL */}
      {showCalibrationGuide && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-white">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Compass className="w-5 h-5" />
                <span>Kalibrasi Magnetometer HP</span>
              </div>
              <button
                onClick={() => setShowCalibrationGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="relative w-32 h-20 flex items-center justify-center">
                <svg className="w-full h-full text-sky-400" viewBox="0 0 100 50">
                  <path
                    d="M 25,25 C 25,12 10,12 10,25 C 10,38 25,38 50,25 C 75,12 90,12 90,25 C 90,38 75,38 50,25 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  <circle cx="25" cy="25" r="4" fill="#38bdf8" className="animate-ping" />
                </svg>
              </div>
              <p className="text-xs text-center text-slate-300 mt-3 leading-relaxed">
                Pegang ponsel lalu gerakkan membentuk pola <strong>angka delapan (∞)</strong> di udara secara perlahan sebanyak 3 kali untuk menstabilkan kompas.
              </p>
            </div>

            <button
              onClick={() => setShowCalibrationGuide(false)}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-xs text-white transition-all cursor-pointer shadow-lg"
            >
              Selesai & Lanjutkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
