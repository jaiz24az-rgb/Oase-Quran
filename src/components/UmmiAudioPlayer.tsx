import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Gauge,
  Repeat,
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';
import { recitationPlayer, PlayerState, UmmiTajwidDetail } from '../utils/recitationAudio';

interface UmmiAudioPlayerProps {
  itemId: string;
  itemTitle: string;
  surahRef?: string;
  compact?: boolean;
}

export const UmmiAudioPlayer: React.FC<UmmiAudioPlayerProps> = ({
  itemId,
  itemTitle,
  surahRef,
  compact = false,
}) => {
  const [playerState, setPlayerState] = useState<PlayerState>(recitationPlayer.getState());
  const [showTajwidGuide, setShowTajwidGuide] = useState(false);
  const [showSyncTuner, setShowSyncTuner] = useState(false);

  useEffect(() => {
    const unsubscribe = recitationPlayer.subscribe((state) => {
      setPlayerState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const isCurrentItem = playerState.currentItemId === itemId;
  const isPlayingThis = isCurrentItem && playerState.isPlaying;
  const audioInfo = recitationPlayer.getAudioInfo(itemId, surahRef);
  const ummiDetails: UmmiTajwidDetail | undefined = audioInfo?.ummiDetails;

  const handleTogglePlay = () => {
    recitationPlayer.play(itemId, surahRef);
  };

  const handleSyncOffsetChange = (offsetMs: number) => {
    recitationPlayer.setSyncOffsetMs(offsetMs);
  };

  const handleRateChange = (rate: number) => {
    recitationPlayer.setPlaybackRate(rate);
  };

  const handleRepeatChange = (mode: 1 | 3 | 0) => {
    recitationPlayer.setRepeatMode(mode);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    recitationPlayer.seek(val);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // If compact version (for inline card buttons)
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleTogglePlay}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isPlayingThis
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-400/40'
              : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
          }`}
          title="Dengarkan pelafalan tartil tajwid metode Ummi"
        >
          {isPlayingThis ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Jeda</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Audio Tajwid Ummi</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isPlayingThis
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-emerald-950/60 border-emerald-400 dark:border-emerald-700 shadow-md ring-1 ring-emerald-500/20'
          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
      } p-3.5 sm:p-4 space-y-3`}
    >
      {/* Top Header: Badge, Title & Reciter Info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] tracking-wide flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>STANDAR METODE UMMI</span>
          </span>
          {isPlayingThis && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] tracking-wide flex items-center gap-1 shadow-2xs">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              <span>Highlight Kata Aktif</span>
            </span>
          )}
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
            {audioInfo?.reciterName || 'Tartil Tajwid Bersanad'}
          </span>
        </div>

        {/* Action Toggles: Sync Calibration & Tajwid Guide */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSyncTuner(!showSyncTuner)}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              showSyncTuner
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 bg-white/60 dark:bg-slate-900/60 hover:bg-emerald-100/50'
            }`}
            title="Kalibrasi keselarasan waktu highlight teks dengan audio"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Sync {playerState.syncOffsetMs !== 0 ? `${playerState.syncOffsetMs > 0 ? '+' : ''}${playerState.syncOffsetMs}ms` : '0ms'}</span>
          </button>

          <button
            onClick={() => setShowTajwidGuide(!showTajwidGuide)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Kaidah Tajwid</span>
            {showTajwidGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Controls: Play/Pause, Timeline, Speeds, and Repeats */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform active:scale-95 shrink-0 cursor-pointer ${
            isPlayingThis
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title={isPlayingThis ? 'Jeda pelafalan' : 'Putar pelafalan tartil tajwid metode Ummi'}
        >
          {isPlayingThis ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Progress Bar & Timestamps */}
        <div className="flex-1 w-full space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>{isCurrentItem ? formatTime(playerState.currentTime) : '00:00'}</span>
            <div className="flex items-center gap-1.5 text-xs font-sans text-emerald-800 dark:text-emerald-300 font-semibold">
              {isPlayingThis && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              <span>
                {playerState.repeatMode === 0
                  ? `Loop (Putaran ${playerState.currentRepeatCount})`
                  : playerState.repeatMode === 3
                  ? `Tikrar 3x (${playerState.currentRepeatCount}/3)`
                  : '1x Putar'}
              </span>
            </div>
            <span>{isCurrentItem ? formatTime(playerState.duration) : '00:00'}</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={isCurrentItem ? playerState.progressPercent : 0}
            onChange={handleSeek}
            disabled={!isCurrentItem}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-40"
          />

          {isPlayingThis && (
            <div className="text-[10px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between font-medium">
              <span>💡 Teks Arab tersorot kata demi kata. Ketuk kata Arab untuk lompat audio.</span>
            </div>
          )}
        </div>

        {/* Playback Rate & Repeat Mode Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          {/* Repeat Mode (Tikrar Metode Ummi: 1x, 3x, Loop) */}
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
            <button
              onClick={() => handleRepeatChange(1)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                playerState.repeatMode === 1
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Putar 1 Kali"
            >
              1x
            </button>
            <button
              onClick={() => handleRepeatChange(3)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                playerState.repeatMode === 3
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Tikrar 3 Kali (Standar Pembelajaran Metode Ummi)"
            >
              3x
            </button>
            <button
              onClick={() => handleRepeatChange(0)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                playerState.repeatMode === 0
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Ulangi Terus Tanpa Henti (Loop untuk Tahfizh)"
            >
              <Repeat className="w-3 h-3" />
            </button>
          </div>

          {/* Tempo / Playback Rate (0.75x Talaqqi, 0.85x Ummi, 1.0x Normal) */}
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
            <button
              onClick={() => handleRateChange(0.75)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                playerState.playbackRate === 0.75
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="0.75x - Talaqqi Pelan (Bedah Makhraj)"
            >
              0.75x
            </button>
            <button
              onClick={() => handleRateChange(0.85)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                playerState.playbackRate === 0.85
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="0.85x - Tartil Standar Metode Ummi (Tempo Ideal Hafalan)"
            >
              0.85x
            </button>
            <button
              onClick={() => handleRateChange(1.0)}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                playerState.playbackRate === 1.0
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="1.0x - Normal"
            >
              1.0x
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Audio & Highlight Sync Calibrator Panel */}
      {showSyncTuner && (
        <div className="pt-2 border-t border-emerald-200/70 dark:border-emerald-800/70 space-y-2 text-xs animate-in fade-in duration-150 bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Penyelarasan Sinkronisasi Teks & Audio (Offset Waktu)</span>
            </span>
            <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {playerState.syncOffsetMs !== 0 ? `${playerState.syncOffsetMs > 0 ? '+' : ''}${playerState.syncOffsetMs}ms` : '0ms (Normal)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Preset Cepat:</span>
            {[-150, -75, 0, 75, 150].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSyncOffsetChange(preset)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                  playerState.syncOffsetMs === preset
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {preset === 0 ? '0ms (Standar Optimal)' : preset < 0 ? `${preset}ms (Cepat)` : `+${preset}ms (Lambat)`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-slate-500 font-mono shrink-0">-300ms</span>
            <input
              type="range"
              min="-300"
              max="300"
              step="25"
              value={playerState.syncOffsetMs}
              onChange={(e) => handleSyncOffsetChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-emerald-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-500 font-mono shrink-0">+300ms</span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
            💡 Pilih nilai minus (-) jika menggunakan earphone Bluetooth atau jika highlight terasa tertinggal. Pengaturan ini otomatis tersimpan untuk seluruh ayat dan doa.
          </p>
        </div>
      )}

      {/* Collapsible Kaidah Tajwid Metode Ummi Panel */}
      {showTajwidGuide && ummiDetails && (
        <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs animate-in fade-in duration-200">
          <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
              1. Makhraj & Sifat Huruf (Fashahah):
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {ummiDetails.makhrajNotes}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
              2. Ketukan Mad (Panjang Pendek):
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {ummiDetails.madGuide}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
              3. Dengung (Ghunnah 2 Harakat):
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {ummiDetails.ghunnahGuide}
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
              4. Irama & Tempo Metode Ummi:
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              {ummiDetails.tempoNotes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
