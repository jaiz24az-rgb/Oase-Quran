import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LocationConfig, TarjihSettings } from '../types';
import { calculateTarjihPrayerTimes, calculateQibla } from './prayerTimesTarjih';
import { getKhgtHijriDate } from './khgtCalendar';

export interface PdfExportOptions {
  location: LocationConfig;
  settings: TarjihSettings;
  year: number;
  month: number; // 0-indexed (0 = Januari, 11 = Desember)
  orientation?: 'portrait' | 'landscape';
  includeSunnahTimes?: boolean; // Terbit & Dhuha
  includeKhgtHijri?: boolean;
  paperSize?: 'a4';
}

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Draws an elegant Islamic seal emblem for Oase-Muslim
 * using vector primitives directly in jsPDF canvas.
 */
function drawOaseEmblem(
  doc: jsPDF,
  centerX: number,
  centerY: number,
  radius: number
) {
  // Outer gold halo
  doc.setFillColor(245, 158, 11); // Amber 500
  doc.circle(centerX, centerY, radius + 0.8, 'F');

  // Deep green outer ring
  doc.setFillColor(6, 95, 70); // Emerald 800
  doc.circle(centerX, centerY, radius, 'F');

  // Inner gold ring
  doc.setDrawColor(251, 191, 36); // Amber 400
  doc.setLineWidth(0.6);
  doc.circle(centerX, centerY, radius * 0.78, 'S');

  // Inner deep emerald circle
  doc.setFillColor(4, 120, 87); // Emerald 700
  doc.circle(centerX, centerY, radius * 0.62, 'F');

  // Center Islamic text 'OM'
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(radius * 0.6);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('OM', centerX, centerY + (radius * 0.2), { align: 'center' });
}

/**
 * Generates and returns a styled jsPDF instance with Oase-Muslim branding.
 */
export function generateTarjihSchedulePdf(options: PdfExportOptions): jsPDF {
  const {
    location,
    settings,
    year,
    month,
    orientation = 'portrait',
    includeSunnahTimes = true,
    includeKhgtHijri = true,
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // 1. Top Decorative Brand Bar (Emerald with Gold Stripe)
  doc.setFillColor(6, 95, 70); // Emerald 800
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(217, 119, 6); // Amber 600
  doc.rect(0, 5, pageWidth, 1.2, 'F');

  // 2. Official Header Section
  const headerTopY = 11;
  const emblemRadius = 8;
  const emblemX = margin + emblemRadius + 2;
  const emblemY = headerTopY + emblemRadius + 1;

  // Draw Oase-Muslim Emblem
  drawOaseEmblem(doc, emblemX, emblemY, emblemRadius);

  // Institution Title
  const textStartX = emblemX + emblemRadius + 6;
  doc.setTextColor(6, 95, 70); // Emerald 800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('OASE-MUSLIM • APLIKASI MUSLIM TERPADU', textStartX, headerTopY + 4);

  // Subtitle
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const monthName = MONTH_NAMES_ID[month];
  doc.text(
    `JADWAL WAKTU SHOLAT & IMSAKIYAH BULAN ${monthName.toUpperCase()} ${year}`,
    textStartX,
    headerTopY + 9.5
  );

  // Reference note
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    'Berdasarkan Standar Hisab Astronomis Subuh -18° & Kalender Hijriah Global Tunggal (KHGT)',
    textStartX,
    headerTopY + 14
  );

  // Divider line
  const dividerY = headerTopY + 20;
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.4);
  doc.line(margin, dividerY, pageWidth - margin, dividerY);

  // 3. Location & Calculation Parameters Info Card
  const infoBoxY = dividerY + 3;
  const infoBoxHeight = 16;
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.roundedRect(margin, infoBoxY, contentWidth, infoBoxHeight, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, infoBoxY, contentWidth, infoBoxHeight, 2, 2, 'S');

  // Left Green Accent Bar inside info box
  doc.setFillColor(5, 150, 105); // Emerald 600
  doc.roundedRect(margin, infoBoxY, 2.5, infoBoxHeight, 1, 1, 'F');

  // Calculate Qibla Bearing & Distance
  const qiblaInfo = calculateQibla(location.latitude, location.longitude);

  // Get Hijri Span for the month
  const firstDayHijri = getKhgtHijriDate(new Date(year, month, 1));
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const lastDayHijri = getKhgtHijriDate(new Date(year, month, lastDayOfMonth));
  const hijriSpanText = firstDayHijri.monthName === lastDayHijri.monthName
    ? `${firstDayHijri.monthName} ${firstDayHijri.year} H`
    : `${firstDayHijri.monthName} - ${lastDayHijri.monthName} ${lastDayHijri.year} H`;

  // Info Column 1: Location & Coordinates
  const col1X = margin + 5;
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.setFont('helvetica', 'bold');
  doc.text(`Wilayah / Kota: ${location.name}`, col1X, infoBoxY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const latStr = `${Math.abs(location.latitude).toFixed(4)}° ${location.latitude >= 0 ? 'LU' : 'LS'}`;
  const lonStr = `${Math.abs(location.longitude).toFixed(4)}° ${location.longitude >= 0 ? 'BT' : 'BB'}`;
  doc.text(`Koordinat: ${latStr}, ${lonStr} | Zona Waktu: UTC+${location.timezone}`, col1X, infoBoxY + 9);
  doc.text(`Periode KHGT: ${hijriSpanText}`, col1X, infoBoxY + 13.5);

  // Info Column 2: Qibla & Tarjih Munas 31 Standards
  const col2X = orientation === 'landscape' ? margin + contentWidth * 0.52 : margin + contentWidth * 0.5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 95, 70); // Emerald 800
  doc.text(`Arah Kiblat: ${qiblaInfo.bearing}° U-B (${qiblaInfo.directionCardinal}, ~${qiblaInfo.distanceKm.toLocaleString('id-ID')} km)`, col2X, infoBoxY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Standar Subuh: -18° di Bawah Ufuk | Ihtiyat: +${settings.ihtiyatMinutes} mnt`, col2X, infoBoxY + 9);
  doc.text(`Standar Hisab: Ephemeris Falakiyah Astronomis Kontemporer (Subuh -18°)`, col2X, infoBoxY + 13.5);

  // 4. Monthly Prayer Schedule Data Construction
  const totalDays = new Date(year, month + 1, 0).getDate();
  const tableData: (string | number)[][] = [];

  const headers: string[] = ['Tgl', 'Hari'];
  if (includeKhgtHijri) {
    headers.push('KHGT (Hijriah)');
  }
  headers.push('Imsak', 'Subuh (-18°)*');
  if (includeSunnahTimes) {
    headers.push('Terbit', 'Dhuha');
  }
  headers.push('Dzuhur', 'Ashar', 'Maghrib (Buka)', 'Isya');

  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month, d);
    const times = calculateTarjihPrayerTimes(curDate, location, settings);
    const hijri = getKhgtHijriDate(curDate);
    const dayName = curDate.toLocaleDateString('id-ID', { weekday: 'short' });

    const row: (string | number)[] = [d, dayName];
    if (includeKhgtHijri) {
      row.push(`${hijri.day} ${hijri.monthName.substring(0, 6)}`);
    }
    row.push(times.imsak);
    row.push(times.subuh);
    if (includeSunnahTimes) {
      row.push(times.terbit);
      row.push(times.dhuha);
    }
    row.push(times.dzuhur);
    row.push(times.ashar);
    row.push(times.maghrib);
    row.push(times.isya);

    tableData.push(row);
  }

  // 5. Draw AutoTable with Oase-Muslim Styling
  const tableStartY = infoBoxY + infoBoxHeight + 3.5;

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: tableStartY,
    margin: { left: margin, right: margin, bottom: 26 },
    theme: 'grid',
    styles: {
      fontSize: orientation === 'landscape' ? 8 : 7.2,
      cellPadding: orientation === 'landscape' ? 1.6 : 1.3,
      halign: 'center',
      valign: 'middle',
      textColor: [30, 41, 59], // Slate 800
      lineColor: [226, 232, 240], // Slate 200
      lineWidth: 0.15,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [6, 95, 70], // Emerald 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: orientation === 'landscape' ? 8.2 : 7.5,
      halign: 'center',
      lineColor: [4, 120, 87],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate 50 / Subtle tint
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 10 }, // Tgl
      1: { cellWidth: 14 }, // Hari
      ...(includeKhgtHijri ? { 2: { cellWidth: orientation === 'landscape' ? 26 : 22, textColor: [71, 85, 105] } } : {}),
      // Subuh column (Highlight Column)
      [includeKhgtHijri ? 4 : 3]: {
        fontStyle: 'bold',
        textColor: [4, 120, 87], // Emerald 700
      },
      // Maghrib column (Highlight Buka Puasa)
      [headers.indexOf('Maghrib (Buka)')]: {
        fontStyle: 'bold',
        textColor: [180, 83, 9], // Amber 700
      },
    },
    didParseCell: (data) => {
      // Highlight Friday rows (Jumat)
      const rowDayName = String(tableData[data.row.index]?.[1] || '');
      if (data.section === 'body' && (rowDayName.toLowerCase().includes('jum') || rowDayName.toLowerCase().includes('fri'))) {
        data.cell.styles.fillColor = [240, 253, 244]; // Emerald 50
        if (data.column.index === 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [5, 150, 105]; // Emerald 600
        }
      }

      // Highlight Sunday (Ahad)
      if (data.section === 'body' && (rowDayName.toLowerCase().includes('ahd') || rowDayName.toLowerCase().includes('sun') || rowDayName.toLowerCase().includes('ming'))) {
        if (data.column.index === 1) {
          data.cell.styles.textColor = [225, 29, 72]; // Rose 600
        }
      }
    },
  });

  // 6. Notes & Legal Tarjih Footer
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || tableStartY + 140;
  const footerBoxY = Math.min(finalY + 3, pageHeight - 24);

  // Notes Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, footerBoxY, contentWidth, 16, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, footerBoxY, contentWidth, 16, 1.5, 1.5, 'S');

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 95, 70); // Emerald 800
  doc.text('CATATAN HISAB WAKTU SHOLAT & IMSAKIYAH:', margin + 3, footerBoxY + 3.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    '1. (*) Awal Waktu Subuh dihitung pada ketinggian matahari -18° di bawah ufuk timur sesuai hisab ilmiah kontemporer.',
    margin + 3,
    footerBoxY + 7
  );
  doc.text(
    '2. Waktu Imsak merupakan tanbih (peringatan kehati-hatian) 10 menit sebelum adzan Subuh berkumandang. Waktu Maghrib menandakan terbenamnya seluruh piringan matahari.',
    margin + 3,
    footerBoxY + 10.5
  );
  doc.text(
    `3. Penanggalan Hijriah bersesuaian dengan Kalender Hijriah Global Tunggal (KHGT). Pengaman waktu (Ihtiyat) diterapkan +${settings.ihtiyatMinutes} menit.`,
    margin + 3,
    footerBoxY + 14
  );

  // Signature / Verification stamp text on right side of footer
  doc.setFontSize(6);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184); // Slate 400
  const printedAt = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(
    `Dokumen Jadwal Oase-Muslim: Aplikasi Muslim Terpadu • Dicetak pada ${printedAt}`,
    pageWidth / 2,
    pageHeight - 3.5,
    { align: 'center' }
  );

  return doc;
}

/**
 * Convenience helper to download the generated PDF directly to user's device.
 */
export function downloadTarjihSchedulePdf(options: PdfExportOptions): string {
  const doc = generateTarjihSchedulePdf(options);
  const monthName = MONTH_NAMES_ID[options.month];
  const cleanCity = options.location.name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Jadwal_Sholat_Oase_Muslim_${cleanCity}_${monthName}_${options.year}.pdf`;
  doc.save(filename);
  return filename;
}
