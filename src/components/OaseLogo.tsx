import React from 'react';

interface OaseLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  subtitleClassName?: string;
  variant?: 'standalone' | 'badge' | 'full';
  onClick?: (e: React.MouseEvent) => void;
}

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 72,
};

/**
 * Official Oase-Muslim Brand Emblem SVG
 * Features:
 * - Emerald Teal Crescent Moon (Hilal)
 * - Inner Golden Flame / Light Droplet Motif
 */
export const OaseEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="oase-teal" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="30%" stopColor="#0d9488" />
          <stop offset="65%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="oase-gold" x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Crescent Moon (Hilal) */}
      <path
        d="
          M 276, 28
          C 272, 28 266, 31 261, 35
          C 152, 62 70, 160 70, 276
          C 70, 396 166, 492 286, 492
          C 362, 492 430, 452 468, 392
          C 469, 390 467, 386 464, 384
          C 453, 376 439, 356 439, 338
          C 439, 332 443, 325 448, 318
          C 450, 315 446, 312 443, 314
          C 418, 334 386, 346 352, 348
          C 232, 356 138, 260 138, 148
          C 138, 102 154, 62 186, 32
          C 192, 26 204, 21 216, 20
          C 220, 19 278, 27 276, 28 Z
        "
        fill="url(#oase-teal)"
      />

      {/* Inner Golden Flame Motif */}
      <path
        d="
          M 288, 86
          C 288, 86 258, 168 244, 210
          C 234, 238 230, 266 238, 294
          C 248, 328 276, 354 310, 362
          C 342, 370 376, 358 398, 334
          C 384, 340 366, 342 348, 338
          C 316, 328 294, 304 286, 274
          C 278, 246 286, 216 302, 186
          C 316, 160 322, 128 318, 102
          C 316, 92 300, 82 288, 86 Z
        "
        fill="url(#oase-gold)"
      />

      <path
        d="
          M 312, 136
          C 312, 136 286, 194 282, 230
          C 278, 260 290, 290 314, 308
          C 334, 322 360, 320 378, 308
          C 364, 308 350, 302 338, 290
          C 322, 274 316, 248 322, 224
          C 328, 198 346, 180 352, 156
          C 356, 142 348, 130 334, 130
          C 324, 130 318, 132 312, 136 Z
        "
        fill="url(#oase-gold)"
      />

      <path
        d="
          M 230, 232
          C 220, 256 218, 282 226, 308
          C 236, 350 272, 382 316, 392
          C 350, 400 388, 394 416, 374
          C 388, 386 354, 388 324, 380
          C 286, 368 256, 332 248, 296
          C 244, 278 244, 258 248, 240
          C 249, 236 233, 226 230, 232 Z
        "
        fill="url(#oase-gold)"
        opacity="0.9"
      />
    </svg>
  );
};

export const OaseLogo: React.FC<OaseLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  textClassName = '',
  subtitleClassName = '',
  variant = 'badge',
  onClick,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size];

  const emblem =
    variant === 'badge' ? (
      <div
        className="rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 p-1 sm:p-1.5 shadow-xs ring-1 ring-emerald-900/10 dark:ring-emerald-400/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <OaseEmblem size={Math.round(pixelSize * 0.82)} />
      </div>
    ) : (
      <OaseEmblem size={pixelSize} />
    );

  if (!showText) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {emblem}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      title="Oase-Muslim"
    >
      {emblem}
      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight leading-none text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors ${textClassName || 'text-sm sm:text-base'}`}
        >
          Oase-Muslim
        </span>
        <span
          className={`text-emerald-700 dark:text-emerald-400 font-medium leading-tight mt-0.5 ${subtitleClassName || 'text-[10px] sm:text-[11px]'}`}
        >
          Aplikasi Muslim Terpadu
        </span>
      </div>
    </div>
  );
};
