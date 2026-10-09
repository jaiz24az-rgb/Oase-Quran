import React, { useState } from 'react';
import { Calendar, Globe2, ShieldCheck, ChevronLeft, ChevronRight, Info, Star, Compass, Clock, ArrowRightLeft } from 'lucide-react';
import {
  getKhgtHijriDate,
  HIJRI_MONTHS,
  KHGT_MAJOR_EVENTS,
  KHGT_PRINCIPLES,
  getTodayFastingNote,
} from '../utils/khgtCalendar';

export const KhgtCalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  // Gregorian to KHGT interactive converter
  const [convertGregDate, setConvertGregDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [convertResult, setConvertResult] = useState<string>(() => {
    const info = getKhgtHijriDate(new Date());
    return info.formatted;
  });

  const todayHijri = getKhgtHijriDate(new Date());
  const selectedDayHijri = getKhgtHijriDate(selectedDay);
  const todayFasting = getTodayFastingNote(todayHijri, new Date().getDay());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleConvert = (dateStr: string) => {
    setConvertGregDate(dateStr);
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const res = getKhgtHijriDate(d);
      setConvertResult(res.formatted);
    }
  };

  // Calendar matrix generator for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Empty padding for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const monthNamesId = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  return (
    <div className="space-y-6">
      {/* KHGT Hero Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-emerald-200">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Standar Penanggalan Global Tunggal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Kalender Hijriah Global Tunggal (KHGT)
            </h1>
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Inovasi kalender peradaban Islam untuk menyatukan penanggalan umat Islam di seluruh dunia dengan prinsip: <em>Satu Hari Satu Tanggal Hijriah</em> di seluruh muka bumi.
            </p>
          </div>

          {/* Today KHGT Card */}
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[220px]">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold block">
              Tanggal KHGT Hari Ini:
            </span>
            <span className="text-xl sm:text-2xl font-black text-white block mt-0.5">
              {todayHijri.formatted}
            </span>
            <span className="text-xs text-slate-300 block">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} M
            </span>
            {todayFasting && (
              <div className="mt-2 text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-1 rounded">
                ⭐ {todayFasting}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {KHGT_PRINCIPLES.map((principle, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {principle.title}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {principle.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar Grid & Events Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monthly Calendar (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {monthNamesId[month]} {year} M
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                Pilih tanggal untuk melihat rincian Hijriah KHGT
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Hari Ini
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                title="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 pb-1">
            <span className="text-rose-500">Ahad</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span className="text-emerald-600 font-bold">Jum</span>
            <span>Sab</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((d, index) => {
              if (!d) {
                return <div key={`empty-${index}`} className="h-16 sm:h-18 rounded-xl bg-slate-50/50 dark:bg-slate-800/40" />;
              }

              const hijri = getKhgtHijriDate(d);
              const isToday =
                d.getDate() === new Date().getDate() &&
                d.getMonth() === new Date().getMonth() &&
                d.getFullYear() === new Date().getFullYear();

              const isSelected =
                d.getDate() === selectedDay.getDate() &&
                d.getMonth() === selectedDay.getMonth() &&
                d.getFullYear() === selectedDay.getFullYear();

              const isAyyamulBidh = hijri.day === 13 || hijri.day === 14 || hijri.day === 15;
              const isFriday = d.getDay() === 5;

              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSelectedDay(d)}
                  className={`h-16 sm:h-18 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20 shadow-xs'
                      : isToday
                      ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'border-slate-100 dark:border-slate-700/70 hover:border-emerald-300 dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-extrabold ${
                        isToday
                          ? 'text-amber-600 dark:text-amber-400'
                          : d.getDay() === 0
                          ? 'text-rose-500'
                          : isFriday
                          ? 'text-emerald-600'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {isAyyamulBidh && (
                      <span className="text-[9px] text-amber-500 font-bold" title="Puasa Ayyamul Bidh">
                        ⭐
                      </span>
                    )}
                  </div>

                  <div className="w-full text-right">
                    <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-mono block">
                      {hijri.day}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate block">
                      {hijri.monthName.slice(0, 5)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Date Detail Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-400 block">Tanggal Dipilih:</span>
              <strong className="text-slate-900 dark:text-white">
                {selectedDay.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                Konversi KHGT:
              </span>
              <strong className="text-emerald-700 dark:text-emerald-300 font-bold">
                {selectedDayHijri.formatted}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Column: Major Islamic Events & Converter (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Masehi <-> KHGT Fast Converter */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
              <span>Konverter Masehi ke Hijriah KHGT</span>
            </h4>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 block">Pilih Tanggal Masehi:</label>
              <input
                type="date"
                value={convertGregDate}
                onChange={(e) => handleConvert(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm">
                <span className="text-emerald-800 dark:text-emerald-300 block font-medium">
                  Hasil Tanggal KHGT:
                </span>
                <span className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                  {convertResult}
                </span>
              </div>
            </div>
          </div>

          {/* Major Islamic Events List (KHGT Schedule) */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Hari Besar Islam & Puasa KHGT</span>
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                Global
              </span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
              {KHGT_MAJOR_EVENTS.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-700/80 hover:border-emerald-300 bg-slate-50/50 dark:bg-slate-900/40 transition-all space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {ev.title}
                    </h5>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold whitespace-nowrap ${
                        ev.type === 'hari_raya'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : ev.type === 'puasa_wajib'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {ev.hijriDate}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Masehi: {ev.gregorianDate}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {ev.description}
                  </p>
                  {ev.khgtNote && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 italic">
                      • {ev.khgtNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
