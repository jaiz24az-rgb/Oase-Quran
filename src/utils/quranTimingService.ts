/**
 * Service to retrieve exact word-by-word audio segment timestamps for Al-Qur'an recitations.
 * Grounded in Quran.com API (Mishari Rashid Al-Afasy recitation #7, matching EveryAyah & equran.id audio).
 */

export interface WordTimingSegment {
  wordIndex: number; // 0-indexed position of spoken word in the ayah
  startSec: number;  // Seconds from start of ayah audio
  endSec: number;    // Seconds from start of ayah audio
}

// In-memory cache by surah number
const timingsCache: Map<number, Record<number, WordTimingSegment[]>> = new Map();
const pendingRequests: Map<number, Promise<Record<number, WordTimingSegment[]>>> = new Map();

/**
 * Fetch and parse word-by-word timestamps for all ayahs in a surah.
 */
export async function getSurahWordTimings(
  surahNumber: number
): Promise<Record<number, WordTimingSegment[]>> {
  if (timingsCache.has(surahNumber)) {
    return timingsCache.get(surahNumber)!;
  }

  if (pendingRequests.has(surahNumber)) {
    return pendingRequests.get(surahNumber)!;
  }

  const promise = (async () => {
    try {
      const res = await fetch(
        `https://api.quran.com/api/v4/chapter_recitations/7/${surahNumber}?segments=true`
      );
      if (!res.ok) {
        return {};
      }
      const data = await res.json();
      const timestamps = data?.audio_file?.timestamps;
      if (!Array.isArray(timestamps)) {
        return {};
      }

      const result: Record<number, WordTimingSegment[]> = {};

      for (const item of timestamps) {
        // verse_key is formatted as "surah:ayah", e.g. "1:1"
        const parts = String(item.verse_key || '').split(':');
        const ayahNum = parseInt(parts[1], 10);
        if (isNaN(ayahNum)) continue;

        const ayahStartMs = typeof item.timestamp_from === 'number' ? item.timestamp_from : 0;
        const rawSegments: unknown[] = Array.isArray(item.segments) ? item.segments : [];

        // Valid segments have [wordPosition, startMs, endMs]
        const validSegments = rawSegments.filter(
          (seg: unknown): seg is [number, number, number] =>
            Array.isArray(seg) && seg.length >= 3 && typeof seg[0] === 'number'
        );

        if (validSegments.length === 0) continue;

        // Group or convert segments to relative seconds
        const wordTimings: WordTimingSegment[] = validSegments.map((seg: [number, number, number]) => {
          const rawWordNum = seg[0]; // 1-indexed word number
          const startMs = seg[1];
          const endMs = seg[2];

          const startSec = Math.max(0, (startMs - ayahStartMs) / 1000);
          const endSec = Math.max(startSec + 0.1, (endMs - ayahStartMs) / 1000);

          return {
            wordIndex: rawWordNum - 1, // convert to 0-indexed
            startSec,
            endSec,
          };
        });

        // Sort by startSec
        wordTimings.sort((a, b) => a.startSec - b.startSec);

        // Ensure non-overlapping endSec with next startSec for smooth progression
        for (let i = 0; i < wordTimings.length - 1; i++) {
          if (wordTimings[i].endSec > wordTimings[i + 1].startSec) {
            wordTimings[i].endSec = wordTimings[i + 1].startSec;
          }
        }

        result[ayahNum] = wordTimings;
      }

      timingsCache.set(surahNumber, result);
      return result;
    } catch (err) {
      console.warn(`Could not load exact word timings for Surah ${surahNumber}:`, err);
      return {};
    } finally {
      pendingRequests.delete(surahNumber);
    }
  })();

  pendingRequests.set(surahNumber, promise);
  return promise;
}

/**
 * Get word-by-word timing for a single ayah.
 */
export async function getAyahWordTimings(
  surahNumber: number,
  ayahNumber: number
): Promise<WordTimingSegment[] | null> {
  const surahTimings = await getSurahWordTimings(surahNumber);
  return surahTimings[ayahNumber] || null;
}
