import React, { useState } from 'react';
import { QuranMedicalEntry, MedicalDiagramLabel } from '../types';
import { Sparkles, Info, Eye } from 'lucide-react';

interface MedicalVisualDiagramProps {
  entry: QuranMedicalEntry;
}

export const MedicalVisualDiagram: React.FC<MedicalVisualDiagramProps> = ({ entry }) => {
  const [activeLabelId, setActiveLabelId] = useState<string>(
    entry.visualIllustration.diagramData.labels[0]?.id || ''
  );

  const activeLabel = entry.visualIllustration.diagramData.labels.find(
    (l) => l.id === activeLabelId
  ) || entry.visualIllustration.diagramData.labels[0];

  // Specific custom SVG illustration based on entry id
  const renderSvgArtwork = () => {
    const id = entry.id;

    if (id === 'sujud-hemodinamika-otak') {
      return (
        <svg viewBox="0 0 500 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="bloodFlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Floor surface line */}
          <line x1="20" y1="250" x2="480" y2="250" stroke="#94A3B8" strokeWidth="3" strokeDasharray="6 6" />
          <text x="40" y="268" fill="#64748B" fontSize="11" fontWeight="bold">Lantai / Sajadah (Gravitasi Terbalik)</text>

          {/* Prostrating Body Silhouette Outline */}
          {/* Back/spine arc */}
          <path
            d="M 400 130 C 370 120, 320 130, 270 160 C 230 185, 190 220, 140 245"
            fill="none"
            stroke="#6366F1"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Neck & Head in Sujud (Forehead touching floor at x=130, y=248) */}
          <ellipse cx="135" cy="225" rx="36" ry="26" transform="rotate(35 135 225)" fill="url(#brainGrad)" opacity="0.9" />

          {/* Prefrontal Cortex (Area Dahi/Ubun-ubun) */}
          <path
            d="M 120 235 C 115 220, 130 205, 145 208 C 135 225, 125 240, 120 235 Z"
            fill="#FBBF24"
            className="animate-pulse"
          />
          <text x="65" y="195" fill="#B45309" fontSize="10" fontWeight="bold">Korteks Prefrontal</text>
          <line x1="105" y1="200" x2="125" y2="220" stroke="#F59E0B" strokeWidth="1.5" />

          {/* Carotid Artery & Cerebral Blood Flow Direction Arrows */}
          <path
            d="M 310 165 C 260 180, 200 205, 155 225"
            fill="none"
            stroke="url(#bloodFlowGrad)"
            strokeWidth="4"
            strokeDasharray="4 3"
          />
          <circle cx="155" cy="225" r="4" fill="#EF4444" />
          <text x="210" y="180" fill="#DC2626" fontSize="10" fontWeight="bold">Arteri Karotis (Aliran O₂ Gravitasi)</text>

          {/* Lumbar & Cervical Spine Points */}
          <circle cx="340" cy="130" r="5" fill="#3B82F6" />
          <text x="320" y="115" fill="#1D4ED8" fontSize="10" fontWeight="bold">Tulang Servikal Rileks</text>

          {/* Arm and Hands on Floor */}
          <path
            d="M 230 190 Q 200 220, 190 248"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <ellipse cx="190" cy="248" rx="14" ry="5" fill="#64748B" />
        </svg>
      );
    }

    if (id === 'madu-lebah') {
      return (
        <svg viewBox="0 0 500 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="honeycombGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="honeyDrop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Honeycomb Hexagons background */}
          <g fill="none" stroke="#FDE68A" strokeWidth="2" opacity="0.6">
            <polygon points="120,40 145,25 170,40 170,70 145,85 120,70" />
            <polygon points="175,40 200,25 225,40 225,70 200,85 175,70" />
            <polygon points="148,88 173,73 198,88 198,118 173,133 148,118" fill="#FEF3C7" opacity="0.8" />
            <polygon points="203,88 228,73 253,88 253,118 228,133 203,118" />
          </g>

          {/* Big Honey Droplet with active enzymes */}
          <path
            d="M 250 80 C 230 130, 180 180, 180 215 C 180 250, 212 270, 250 270 C 288 270, 320 250, 320 215 C 320 180, 270 130, 250 80 Z"
            fill="url(#honeyDrop)"
            filter="drop-shadow(0px 8px 16px rgba(217, 119, 6, 0.3))"
          />

          {/* Sparkles on Honey Drop */}
          <circle cx="230" cy="200" r="14" fill="#FFFFFF" opacity="0.3" />

          {/* Bioactive tags inside drop */}
          <rect x="205" y="185" width="90" height="22" rx="11" fill="#FFFFFF" opacity="0.9" />
          <text x="250" y="200" fill="#92400E" fontSize="10" fontWeight="bold" textAnchor="middle">H₂O₂ + MGO</text>

          {/* Bacteria Lysis on Side */}
          <g transform="translate(360, 130)">
            <ellipse cx="40" cy="40" rx="30" ry="20" fill="#FCA5A5" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
            <text x="40" y="38" fill="#991B1B" fontSize="9" fontWeight="bold" textAnchor="middle">Lisis Bakteri</text>
            <text x="40" y="50" fill="#7F1D1D" fontSize="8" textAnchor="middle">(H. Pylori)</text>
          </g>

          {/* Stomach Mucosa Protection on Left */}
          <g transform="translate(40, 140)">
            <path d="M 10 30 Q 50 10, 80 50 T 110 80" fill="none" stroke="#F59E0B" strokeWidth="5" />
            <text x="60" y="25" fill="#B45309" fontSize="10" fontWeight="bold">Mukosa Lambung</text>
            <text x="60" y="95" fill="#78350F" fontSize="9">Epitelisasi Cepat</text>
          </g>
        </svg>
      );
    }

    if (id === 'minyak-zaitun') {
      return (
        <svg viewBox="0 0 500 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="arteryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FECACA" />
              <stop offset="50%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#84CC16" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
          </defs>

          {/* Cross section of Healthy Endothelium Artery */}
          <rect x="60" y="70" width="380" height="130" rx="20" fill="#FEF2F2" stroke="#DC2626" strokeWidth="4" />
          <rect x="80" y="85" width="340" height="100" rx="14" fill="#FFFFFF" />

          {/* Endothelial Cell Layer Lining */}
          <g fill="#10B981" opacity="0.8">
            <rect x="85" y="85" width="330" height="8" rx="4" />
            <rect x="85" y="177" width="330" height="8" rx="4" />
          </g>
          <text x="250" y="80" fill="#047857" fontSize="10" fontWeight="bold" textAnchor="middle">Lapisan Sel Endotel Sehat (Dilindungi Polifenol Zaitun)</text>

          {/* Blood flow with HDL & NO vasodilators */}
          <g transform="translate(100, 110)">
            <ellipse cx="60" cy="25" rx="18" ry="12" fill="#34D399" opacity="0.9" />
            <text x="60" y="28" fill="#064E3B" fontSize="9" fontWeight="bold" textAnchor="middle">HDL</text>

            <ellipse cx="150" cy="25" rx="22" ry="14" fill="#6EE7B7" opacity="0.9" />
            <text x="150" y="28" fill="#064E3B" fontSize="9" fontWeight="bold" textAnchor="middle">Nitric Oxide</text>

            <ellipse cx="240" cy="25" rx="18" ry="12" fill="#34D399" opacity="0.9" />
            <text x="240" y="28" fill="#064E3B" fontSize="9" fontWeight="bold" textAnchor="middle">Oleat</text>
          </g>

          {/* Olive Branch & Fruit on Top Right */}
          <g transform="translate(390, 20)">
            <ellipse cx="30" cy="30" rx="15" ry="22" transform="rotate(-25 30 30)" fill="url(#oilGrad)" />
            <circle cx="26" cy="25" r="5" fill="#FFFFFF" opacity="0.4" />
          </g>

          <text x="250" y="235" fill="#15803D" fontSize="11" fontWeight="bold" textAnchor="middle">
            Vasodilatasi Arteri Koroner: Menurunkan Beban Tahanan Jantung (BP Normal)
          </text>
        </svg>
      );
    }

    if (id === 'autofagi-puasa') {
      return (
        <svg viewBox="0 0 500 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cellBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="100%" stopColor="#D1FAE5" />
            </linearGradient>
          </defs>

          {/* Huge Eukaryotic Cell Outline */}
          <rect x="40" y="30" width="420" height="220" rx="40" fill="url(#cellBg)" stroke="#10B981" strokeWidth="3" />
          <text x="70" y="60" fill="#047857" fontSize="11" fontWeight="bold">Sel Tubuh Saat Puasa (Jam ke 12 - 16)</text>

          {/* 1. Damaged Mitochondria / Debris */}
          <g transform="translate(90, 95)">
            <rect x="0" y="0" width="60" height="36" rx="18" fill="#FCA5A5" stroke="#EF4444" strokeWidth="2" />
            <text x="30" y="22" fill="#991B1B" fontSize="8" fontWeight="bold" textAnchor="middle">Mitokondria Aus</text>
          </g>

          {/* Arrow */}
          <path d="M 160 115 L 185 115" stroke="#059669" strokeWidth="3" markerEnd="url(#arrow)" />

          {/* 2. Autophagosome formation */}
          <g transform="translate(195, 80)">
            <circle cx="35" cy="35" r="32" fill="#6EE7B7" stroke="#047857" strokeWidth="2" strokeDasharray="4 2" />
            <text x="35" y="32" fill="#064E3B" fontSize="8" fontWeight="bold" textAnchor="middle">Autofagosom</text>
            <text x="35" y="44" fill="#065F46" fontSize="7" textAnchor="middle">(Kantung Bungkus)</text>
          </g>

          {/* Plus sign */}
          <text x="275" y="120" fill="#047857" fontSize="18" fontWeight="bold">+</text>

          {/* 3. Lysosome with digestive enzymes */}
          <g transform="translate(295, 85)">
            <circle cx="28" cy="28" r="26" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            <text x="28" y="26" fill="#713F12" fontSize="8" fontWeight="bold" textAnchor="middle">Lisosom</text>
            <text x="28" y="37" fill="#854D0E" fontSize="7" textAnchor="middle">(Enzim Asam)</text>
          </g>

          {/* Arrow */}
          <path d="M 360 115 L 385 115" stroke="#059669" strokeWidth="3" />

          {/* 4. Regenerated Amino Acids / Fresh ATP */}
          <g transform="translate(395, 85)">
            <rect x="0" y="0" width="55" height="55" rx="12" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <text x="28" y="24" fill="#0C4A6E" fontSize="8" fontWeight="bold" textAnchor="middle">Asam Amino</text>
            <text x="28" y="36" fill="#075985" fontSize="8" fontWeight="bold" textAnchor="middle">& ATP Baru</text>
          </g>

          {/* Bottom Banner */}
          <rect x="70" y="195" width="360" height="36" rx="10" fill="#047857" />
          <text x="250" y="217" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
            Nobel Kedokteran: Daur Ulang Seluler Menghancurkan Sel Kanker & Mencegah Alzheimer
          </text>
        </svg>
      );
    }

    if (id === 'kaidah-sepertiga-lambung') {
      return (
        <svg viewBox="0 0 500 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          {/* Stomach Outline Diagram */}
          <path
            d="M 180 50 C 180 30, 220 30, 220 60 C 230 110, 340 120, 340 190 C 340 250, 230 260, 170 240 C 120 220, 100 160, 130 110 C 150 75, 180 65, 180 50 Z"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="4"
          />

          {/* Compartment lines inside stomach */}
          {/* Lower 1/3 (Food) */}
          <path
            d="M 130 180 C 180 185, 270 190, 335 185 C 335 235, 230 255, 170 235 C 135 220, 125 195, 130 180 Z"
            fill="#F59E0B"
            opacity="0.9"
          />
          <text x="225" y="215" fill="#78350F" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            1/3 Makanan (Kimus)
          </text>

          {/* Middle 1/3 (Liquid) */}
          <path
            d="M 135 125 C 180 135, 250 140, 315 130 L 335 185 C 270 190, 180 185, 130 180 Z"
            fill="#38BDF8"
            opacity="0.8"
          />
          <text x="225" y="160" fill="#0C4A6E" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            1/3 Minuman & Enzim
          </text>

          {/* Upper 1/3 (Air / Breathing) */}
          <text x="215" y="105" fill="#047857" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            1/3 Udara / Ruang Kosong
          </text>

          {/* Lower Esophageal Sphincter Valve */}
          <ellipse cx="200" cy="55" rx="14" ry="7" fill="#10B981" />
          <text x="200" y="40" fill="#047857" fontSize="9" fontWeight="bold" textAnchor="middle">
            Katup LES Tertutup Rapat
          </text>

          {/* Info callout */}
          <g transform="translate(360, 90)">
            <rect x="0" y="0" width="120" height="70" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
            <text x="60" y="20" fill="#065F46" fontSize="9" fontWeight="bold" textAnchor="middle">Bebas GERD & Maag</text>
            <text x="60" y="38" fill="#047857" fontSize="8" textAnchor="middle">Tidak menekan</text>
            <text x="60" y="52" fill="#047857" fontSize="8" textAnchor="middle">diafragma & paru</text>
          </g>
        </svg>
      );
    }

    if (id === 'rukuk-biomekanika-tulang') {
      return (
        <svg viewBox="0 0 500 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          {/* Ground level */}
          <line x1="40" y1="240" x2="460" y2="240" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />

          {/* Perfect 90 degree Angle Guide Lines */}
          <line x1="280" y1="120" x2="100" y2="120" stroke="#10B981" strokeWidth="2" strokeDasharray="5 3" />
          <line x1="280" y1="120" x2="280" y2="240" stroke="#10B981" strokeWidth="2" strokeDasharray="5 3" />
          <text x="295" y="140" fill="#059669" fontSize="12" fontWeight="bold">Sudut 90°</text>

          {/* Stick Human Biomechanics in Ruku */}
          {/* Legs standing straight */}
          <line x1="280" y1="240" x2="280" y2="120" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
          {/* Pelvis Pivot */}
          <circle cx="280" cy="120" r="10" fill="#1D4ED8" />

          {/* Spine Horizontal (Flat like water bowl) */}
          <line x1="280" y1="120" x2="130" y2="120" stroke="#6366F1" strokeWidth="8" strokeLinecap="round" />
          {/* Cervical & Head (Neck straight with back) */}
          <line x1="130" y1="120" x2="100" y2="120" stroke="#818CF8" strokeWidth="7" strokeLinecap="round" />
          <circle cx="85" cy="120" r="14" fill="#4338CA" />

          {/* Arms reaching knees with fingers gripping */}
          <line x1="150" y1="120" x2="220" y2="180" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
          <circle cx="220" cy="180" r="8" fill="#F59E0B" />
          <text x="235" y="195" fill="#B45309" fontSize="9" fontWeight="bold">Lutut Digenggam</text>

          {/* Lumbar Spine Callout (L1 - L5 disc decompression) */}
          <rect x="180" y="60" width="160" height="42" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="260" y="78" fill="#1E40AF" fontSize="9" fontWeight="bold" textAnchor="middle">Dekompresi Diskus Lumbal (L4-S1)</text>
          <text x="260" y="92" fill="#1D4ED8" fontSize="8" textAnchor="middle">Membuka foramen saraf skiatika</text>
        </svg>
      );
    }

    // Default Generic Medical Graphic for other entries
    return (
      <svg viewBox="0 0 500 280" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <rect x="30" y="20" width="440" height="240" rx="24" fill="url(#genGrad)" stroke="#0D9488" strokeWidth="2" strokeDasharray="6 4" />

        {/* Central Anatomical Hexagon */}
        <polygon points="250,55 330,105 330,205 250,255 170,205 170,105" fill="#FFFFFF" stroke="#0F766E" strokeWidth="3" opacity="0.95" />

        <circle cx="250" cy="155" r="42" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="3" />
        <text x="250" y="152" fill="#0F766E" fontSize="12" fontWeight="extrabold" textAnchor="middle">QUR'AN</text>
        <text x="250" y="167" fill="#0D9488" fontSize="11" fontWeight="bold" textAnchor="middle">MEDIS</text>

        {/* Dynamic Nodes connecting */}
        {entry.visualIllustration.diagramData.labels.map((lbl, idx) => {
          const cx = (lbl.x / 100) * 500;
          const cy = (lbl.y / 100) * 280;
          return (
            <g key={lbl.id}>
              <line x1="250" y1="155" x2={cx} y2={cy} stroke="#14B8A6" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
              <circle cx={cx} cy={cy} r="16" fill="#0D9488" />
              <text x={cx} y={cy + 4} fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">{idx + 1}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/80 rounded-2xl p-3 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              {entry.visualIllustration.diagramData.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {entry.visualIllustration.diagramData.subtitle}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <Eye className="w-3.5 h-3.5" />
          Infografis Anatomi Interaktif
        </span>
      </div>

      {/* SVG Canvas Container with Interactive Overlay Pins */}
      <div className="relative w-full aspect-16/9 max-h-[300px] bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
        {renderSvgArtwork()}

        {/* Interactive Clickable Hotspot Pins */}
        {entry.visualIllustration.diagramData.labels.map((lbl, idx) => {
          const isActive = lbl.id === activeLabelId;
          return (
            <button
              key={lbl.id}
              onClick={() => setActiveLabelId(lbl.id)}
              style={{ left: `${lbl.x}%`, top: `${lbl.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all cursor-pointer z-10 ${
                isActive
                  ? 'w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-600 text-white shadow-lg ring-4 ring-rose-300 dark:ring-rose-800 scale-110 font-black'
                  : 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white shadow-md hover:scale-110 font-bold opacity-90'
              } text-[10px] sm:text-xs`}
              title={`${idx + 1}. ${lbl.title}: ${lbl.desc}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center italic mt-2">
        {entry.visualIllustration.caption} (Ketuk angka pin 1-4 pada gambar untuk melihat mekanisme)
      </p>

      {/* Active Pin Detail Card */}
      {activeLabel && (
        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/80 shadow-xs flex items-start gap-2.5 transition-all animate-in fade-in zoom-in-95">
          <div className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {entry.visualIllustration.diagramData.labels.findIndex((l) => l.id === activeLabel.id) + 1}
          </div>
          <div className="flex-1">
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>{activeLabel.title}</span>
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              {activeLabel.desc}
            </p>
          </div>
        </div>
      )}

      {/* Pills to quickly click between points */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2.5">
        {entry.visualIllustration.diagramData.labels.map((lbl, idx) => (
          <button
            key={lbl.id}
            onClick={() => setActiveLabelId(lbl.id)}
            className={`px-2 py-1.5 rounded-lg text-[11px] font-medium text-left truncate transition-all cursor-pointer ${
              lbl.id === activeLabelId
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="font-bold mr-1">{idx + 1}.</span> {lbl.title}
          </button>
        ))}
      </div>
    </div>
  );
};
