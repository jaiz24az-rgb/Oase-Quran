// Audio and notification utility for prayer reminders

class AudioReminderManager {
  private audioCtx: AudioContext | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play a melodious synthesized Islamic chime / Takbir sequence using Web Audio API.
   * Guaranteed to work offline with zero external network dependency.
   */
  public playSynthesizedAdzanTakbir(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Islamic Maqam Rast / Bayati melodic frequencies for Takbir ("Allahu Akbar")
      // Sol-Do-Re-Mi-Fa-Sol scale notes (C4, D4, E4, F4, G4, A4)
      const notes = [
        { freq: 261.63, dur: 0.6, pause: 0.1 },  // Al-
        { freq: 329.63, dur: 0.8, pause: 0.1 },  // laa-
        { freq: 392.00, dur: 1.2, pause: 0.2 },  // hu
        { freq: 349.23, dur: 0.8, pause: 0.1 },  // Ak-
        { freq: 261.63, dur: 1.6, pause: 0.4 },  // bar

        // Repeat Takbir line
        { freq: 261.63, dur: 0.6, pause: 0.1 },
        { freq: 329.63, dur: 0.8, pause: 0.1 },
        { freq: 392.00, dur: 1.2, pause: 0.2 },
        { freq: 349.23, dur: 0.8, pause: 0.1 },
        { freq: 261.63, dur: 2.0, pause: 0.5 },
      ];

      let startTime = now + 0.1;

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Soft, resonant waveform resembling reed flute (Ney) / vocal harmonic
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, startTime);

        // Gentle attack, sustained body, smooth decay
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.2, startTime + note.dur * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur);

        // Overtone oscillator for warmth
        const harmOsc = ctx.createOscillator();
        const harmGain = ctx.createGain();
        harmOsc.type = 'triangle';
        harmOsc.frequency.setValueAtTime(note.freq * 2, startTime);
        harmGain.gain.setValueAtTime(0.001, startTime);
        harmGain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.1);
        harmGain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur * 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        harmOsc.connect(harmGain);
        harmGain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.dur);
        harmOsc.start(startTime);
        harmOsc.stop(startTime + note.dur);

        startTime += note.dur + note.pause;
      });
    } catch (err) {
      console.warn('Audio synthesis error:', err);
    }
  }

  public playGentleChime(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const pitches = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      pitches.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const time = now + idx * 0.15;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.3, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 1.3);
      });
    } catch (e) {
      console.warn('Chime playback error:', e);
    }
  }

  public async playFullAdzan(audioUrl = '/audio/adzan.mp3'): Promise<void> {
    try {
      this.stopAudio();
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;
      audio.volume = 0.95;

      audio.onerror = () => {
        // Fallback to secondary high-reliability CDN if local fails
        if (audioUrl !== 'https://download.tvquran.com/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3') {
          this.playFullAdzan('https://download.tvquran.com/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3');
        } else {
          this.playSynthesizedAdzanTakbir();
        }
      };

      await audio.play();
    } catch {
      // Fallback to secondary CDN or Web Audio synthesizer
      try {
        const fallbackAudio = new Audio('https://download.tvquran.com/download/TvQuran.com__Athan/TvQuran.com__01.athan.mp3');
        this.currentAudioElement = fallbackAudio;
        fallbackAudio.volume = 0.95;
        await fallbackAudio.play();
      } catch {
        this.playSynthesizedAdzanTakbir();
      }
    }
  }

  public stopAudio(): void {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }

  public async requestPermission(): Promise<boolean> {
    return this.requestNotificationPermission();
  }

  public showSystemNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Notification trigger error:', e);
      }
    }
  }

  public async playDzikirAudio(audioUrl = 'https://raw.githubusercontent.com/sheikhhanif/Hisnul_Muslim_Database/master/audio/79hm.mp3'): Promise<void> {
    try {
      this.stopAudio();
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;
      audio.volume = 0.95;
      await audio.play();
    } catch {
      this.playGentleChime();
    }
  }

  public showDzikirNotification(title: string, body: string, playSound = true): void {
    if (playSound) {
      this.playDzikirAudio();
    }
    this.showSystemNotification(title, body);
  }

  public showPrayerNotification(prayerName: string, prayerTime: string, soundType: 'adzan' | 'takbir' | 'chime' | 'silent' = 'adzan'): void {
    // Play sound according to settings
    if (soundType === 'adzan') {
      this.playFullAdzan();
    } else if (soundType === 'takbir') {
      this.playSynthesizedAdzanTakbir();
    } else if (soundType === 'chime') {
      this.playGentleChime();
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Waktu Sholat ${prayerName} Telah Tiba (${prayerTime})`, {
          body: `Mari segera tunaikan sholat ${prayerName} tepat pada awal waktu.`,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Notification trigger error:', e);
      }
    }
  }
}

export const audioReminder = new AudioReminderManager();
