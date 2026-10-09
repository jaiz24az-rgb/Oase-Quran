import React from 'react';

export interface TajwidRuleGuide {
  id: string;
  name: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
  letters: string;
}

export const TAJWID_RULES: TajwidRuleGuide[] = [
  {
    id: 'ghunnah',
    name: 'Ghunnah',
    colorClass: 'text-emerald-700 dark:text-emerald-400 font-semibold',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-300 dark:border-emerald-700',
    description: 'Dengung 2 harakat pada huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ).',
    letters: 'نّ ، مّ',
  },
  {
    id: 'ikhfa',
    name: 'Ikhfa Haqiqi',
    colorClass: 'text-amber-700 dark:text-amber-400 font-semibold',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-300 dark:border-amber-700',
    description: 'Menyamarkan bunyi Nun sukun / Tanwin dengan dengung pada 15 huruf.',
    letters: 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
  },
  {
    id: 'idgham',
    name: 'Idgham',
    colorClass: 'text-blue-700 dark:text-blue-400 font-semibold',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-300 dark:border-blue-700',
    description: 'Memasukkan bunyi huruf pertama ke huruf berikutnya (Bighunnah / Bilaghunnah).',
    letters: 'ي ن م و (Bighunnah) | ل ر (Bilaghunnah)',
  },
  {
    id: 'qalqalah',
    name: 'Qalqalah',
    colorClass: 'text-rose-700 dark:text-rose-400 font-semibold',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40',
    borderClass: 'border-rose-300 dark:border-rose-700',
    description: 'Memantulkan bunyi huruf sukun atau waqaf pada 5 huruf Qalqalah.',
    letters: 'ق ط ب ج د (بقط جد)',
  },
  {
    id: 'mad',
    name: 'Mad Wajib / Jaiz / Lazim',
    colorClass: 'text-purple-700 dark:text-purple-400 font-semibold',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-300 dark:border-purple-700',
    description: 'Memanjangkan bacaan 4 hingga 6 harakat yang ditandai dengan tanda layar (ٓ).',
    letters: 'آ ، ٓ (Tanda Mad Panjang)',
  },
  {
    id: 'iqlab',
    name: 'Iqlab',
    colorClass: 'text-teal-700 dark:text-teal-400 font-semibold',
    bgClass: 'bg-teal-50 dark:bg-teal-950/40',
    borderClass: 'border-teal-300 dark:border-teal-700',
    description: 'Mengubah bunyi Nun sukun atau Tanwin menjadi Mim disertai dengung saat bertemu huruf Ba.',
    letters: 'ب (dengan mim kecil ۢ)',
  },
];

/**
 * Parses and highlights Arabic text with Tajwid color codes for Indonesian Mushaf readers.
 */
export function renderTajwidText(text: string, enableTajwid: boolean = true): React.ReactNode {
  if (!enableTajwid) {
    return <span>{text}</span>;
  }

  // Regex patterns for Islamic tajwid rules
  // 1. Qalqalah: letters [قطبجد] with sukun (\u0652)
  // 2. Ghunnah: [نم] with shaddah (\u0651)
  // 3. Mad: letters with maddah sign (\u0653)
  // 4. Iqlab: small mim (\u06E2) or tanwin before ba
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;

  // Pattern matcher scanning through the text
  const tajwidRegex = /([\u0642\u0637\u0628\u062c\u062f]\u0652)|([\u0646\u0645]\u0651)|([^\s]{0,2}\u0653)|([\u06E2ۢ])/g;
  let match: RegExpExecArray | null;

  while ((match = tajwidRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchLength = match[0].length;

    // Normal text before match
    if (matchStart > currentIndex) {
      parts.push(text.slice(currentIndex, matchStart));
    }

    const matchedStr = match[0];

    if (match[1]) {
      // Qalqalah (ق ط ب ج د with sukun)
      parts.push(
        <span
          key={`q-${matchStart}`}
          className="text-rose-600 dark:text-rose-400 font-bold px-0.5 rounded transition-colors"
          title="Qalqalah (pantulan)"
        >
          {matchedStr}
        </span>
      );
    } else if (match[2]) {
      // Ghunnah (نّ or مّ)
      parts.push(
        <span
          key={`g-${matchStart}`}
          className="text-emerald-600 dark:text-emerald-400 font-bold px-0.5 rounded transition-colors"
          title="Ghunnah (dengung 2 harakat)"
        >
          {matchedStr}
        </span>
      );
    } else if (match[3]) {
      // Mad (ٓ)
      parts.push(
        <span
          key={`m-${matchStart}`}
          className="text-purple-600 dark:text-purple-400 font-bold px-0.5 rounded transition-colors"
          title="Mad Wajib / Jaiz (panjang 4-6 harakat)"
        >
          {matchedStr}
        </span>
      );
    } else if (match[4]) {
      // Iqlab (ۢ)
      parts.push(
        <span
          key={`i-${matchStart}`}
          className="text-teal-600 dark:text-teal-400 font-bold px-0.5 rounded transition-colors"
          title="Iqlab (menjadi bunyi Mim)"
        >
          {matchedStr}
        </span>
      );
    } else {
      parts.push(matchedStr);
    }

    currentIndex = matchStart + matchLength;
  }

  // Push remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  return <>{parts}</>;
}
