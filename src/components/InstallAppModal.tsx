import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, Check, X, Share2, PlusSquare, ArrowUpRight } from 'lucide-react';
import { OaseEmblem } from './OaseLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return { deferredPrompt, isInstallable, isInstalled, promptInstall };
};

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onPromptInstall: () => Promise<boolean>;
  isInstalled: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onPromptInstall,
  isInstalled,
}) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 border border-emerald-100 dark:border-slate-700 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Oase-Muslim icon */}
        <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-750 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-750 p-1.5 shadow-md ring-1 ring-emerald-500/20 flex items-center justify-center shrink-0">
            <OaseEmblem size={38} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-emerald-950 dark:text-white leading-tight">
              Pasang Aplikasi Oase-Muslim
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Aplikasi Muslim Terpadu (Desktop PC, Laptop, & HP)
            </p>
          </div>
        </div>

        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
              Aplikasi Sudah Terpasang!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Aplikasi Oase-Muslim telah aktif di perangkat Anda dan dapat diakses langsung dari layar utama atau desktop.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick 1-Click Install Button if supported */}
            {deferredPrompt && (
              <button
                onClick={async () => {
                  await onPromptInstall();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Pasang Sekarang (1-Klik)</span>
              </button>
            )}

            {/* Platform Guides */}
            <div className="space-y-3 pt-1">
              {/* Desktop PC / Laptop Guide */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Desktop PC / Laptop (Windows, Mac, Linux):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pada Google Chrome atau Microsoft Edge, klik ikon <strong>Install / Pasang Aplikasi (ikon komputer dengan panah bawah)</strong> yang berada di ujung kanan <em>address bar</em> (bilah alamat).
                </p>
              </div>

              {/* Android HP Guide */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>HP Android (Chrome, Samsung Internet):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ketuk tombol menu titik tiga (⋮) di pojok kanan atas browser, kemudian pilih <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                </p>
              </div>

              {/* iPhone / iPad (iOS Safari) Guide */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>iPhone / iPad (iOS Safari):</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ketuk tombol <strong>Bagikan (Share)</strong> di bagian bawah browser Safari (ikon kotak dengan panah ke atas), gulir ke bawah lalu ketuk <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bekerja Cepat & Ringan Layaknya Aplikasi Asli (Native)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Notifikasi Adzan & Jadwal Sholat Tetap Berfungsi</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
