/**
 * Chart Export Utilities for Excel Add-in
 *
 * Provides functions to capture charts as images and export to clipboard/Excel.
 * Uses html-to-image library for SVG to PNG conversion.
 */

import { toPng } from 'html-to-image';
import { darkTheme } from './darkTheme';
import type { StatsResult } from '@variscout/core';

/** Chart element IDs used for export */
export const CHART_IDS = {
  iChart: 'variscout-ichart',
  boxplot: 'variscout-boxplot',
  pareto: 'variscout-pareto',
  histogram: 'variscout-histogram',
} as const;

/** All chart IDs in order */
const ALL_CHART_IDS = [CHART_IDS.iChart, CHART_IDS.boxplot, CHART_IDS.pareto, CHART_IDS.histogram];

/** Options for chart capture */
interface CaptureOptions {
  backgroundColor?: string;
  pixelRatio?: number;
}

/**
 * Load an image from a data URL
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Capture a single chart element as PNG data URL
 */
export async function captureChartAsPng(
  elementId: string,
  options: CaptureOptions = {}
): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Chart element not found: ${elementId}`);
    return null;
  }

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: options.backgroundColor ?? darkTheme.colorNeutralBackground2,
      pixelRatio: options.pixelRatio ?? 2,
      cacheBust: true,
    });
    return dataUrl;
  } catch (error) {
    console.error(`Failed to capture chart ${elementId}:`, error);
    return null;
  }
}

/**
 * Capture all 4 charts as a 2x2 grid PNG blob
 */
export async function captureAllChartsAsGrid(): Promise<Blob> {
  const chartWidth = 400;
  const chartHeight = 300;

  // Create canvas for 2x2 grid
  const canvas = document.createElement('canvas');
  canvas.width = chartWidth * 2;
  canvas.height = chartHeight * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create canvas context');
  }

  // Fill background
  ctx.fillStyle = darkTheme.colorNeutralBackground1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid positions: [row, col] for each chart
  const positions = [
    [0, 0], // I-Chart: top-left
    [0, 1], // Boxplot: top-right
    [1, 0], // Pareto: bottom-left
    [1, 1], // Histogram: bottom-right
  ];

  // Capture each chart and draw to canvas
  for (let i = 0; i < ALL_CHART_IDS.length; i++) {
    const dataUrl = await captureChartAsPng(ALL_CHART_IDS[i]);
    if (dataUrl) {
      const img = await loadImage(dataUrl);
      const x = positions[i][1] * chartWidth;
      const y = positions[i][0] * chartHeight;
      ctx.drawImage(img, x, y, chartWidth, chartHeight);
    }
  }

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Copy all charts as a 2x2 grid to clipboard
 */
export async function copyChartsToClipboard(): Promise<void> {
  const blob = await captureAllChartsAsGrid();
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

/**
 * Check if image insertion is supported (ExcelApi 1.9+)
 */
export function canInsertImages(): boolean {
  return Office.context.requirements.isSetSupported('ExcelApi', '1.9');
}

/**
 * Insert all 4 charts into the active Excel worksheet as a 2x2 grid
 */
export async function insertChartsIntoExcel(): Promise<void> {
  if (!canInsertImages()) {
    throw new Error('Image insertion requires Excel 2019 or later (ExcelApi 1.9)');
  }

  const chartWidth = 400;
  const chartHeight = 300;
  const startLeft = 500; // Offset from left edge
  const startTop = 10; // Offset from top

  // Grid positions
  const positions = [
    { left: startLeft, top: startTop }, // I-Chart: top-left
    { left: startLeft + chartWidth + 20, top: startTop }, // Boxplot: top-right
    { left: startLeft, top: startTop + chartHeight + 20 }, // Pareto: bottom-left
    { left: startLeft + chartWidth + 20, top: startTop + chartHeight + 20 }, // Histogram: bottom-right
  ];

  await Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    for (let i = 0; i < ALL_CHART_IDS.length; i++) {
      const dataUrl = await captureChartAsPng(ALL_CHART_IDS[i]);
      if (dataUrl) {
        // Extract base64 data (remove "data:image/png;base64," prefix)
        const base64 = dataUrl.split(',')[1];
        const image = sheet.shapes.addImage(base64);
        image.left = positions[i].left;
        image.top = positions[i].top;
        image.width = chartWidth;
        image.height = chartHeight;
      }
    }

    await context.sync();
  });
}

/**
 * Write statistics results to Excel cells
 */
export async function writeStatsToExcel(
  stats: StatsResult,
  specs: { usl?: number; lsl?: number; target?: number },
  sampleCount: number,
  startCell: string = 'J1'
): Promise<void> {
  await Excel.run(async context => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();

    // Build the results table
    const values: (string | number)[][] = [
      ['VaRiScout Results', ''],
      ['Metric', 'Value'],
      ['n', sampleCount],
      ['Mean', Number(stats.mean.toFixed(4))],
      ['Std Dev', Number(stats.stdDev.toFixed(4))],
      ['UCL (3\u03C3)', Number(stats.ucl.toFixed(4))],
      ['LCL (3\u03C3)', Number(stats.lcl.toFixed(4))],
      ['', ''],
      ['Specification Limits', ''],
      ['USL', specs.usl ?? 'Not set'],
      ['LSL', specs.lsl ?? 'Not set'],
      ['Target', specs.target ?? 'Not set'],
    ];

    // Add capability indices if specs are set
    if (stats.cp !== undefined) {
      values.push(['', '']);
      values.push(['Capability Indices', '']);
      values.push(['Cp', Number(stats.cp.toFixed(3))]);
    }
    if (stats.cpk !== undefined) {
      values.push(['Cpk', Number(stats.cpk.toFixed(3))]);
    }

    // Add out-of-spec percentage
    if (stats.outOfSpecPercentage !== undefined) {
      values.push(['', '']);
      values.push(['Conformance', '']);
      values.push(['In-Spec %', `${(100 - stats.outOfSpecPercentage).toFixed(1)}%`]);
      values.push(['Out-of-Spec %', `${stats.outOfSpecPercentage.toFixed(1)}%`]);
    }

    // Calculate range size
    const rowCount = values.length;
    const colCount = 2;
    const endRow = parseInt(startCell.match(/\d+/)?.[0] ?? '1') + rowCount - 1;
    const startCol = startCell.match(/[A-Z]+/)?.[0] ?? 'J';
    const endCol = String.fromCharCode(startCol.charCodeAt(0) + colCount - 1);
    const rangeAddress = `${startCell}:${endCol}${endRow}`;

    const range = sheet.getRange(rangeAddress);
    range.values = values;
    range.format.autofitColumns();

    // Style the header rows
    const headerRange = sheet.getRange(`${startCell}:${endCol}2`);
    headerRange.format.font.bold = true;

    // Style section headers
    const rows = values.map((row, i) => ({ row, index: i }));
    const sectionHeaders = rows.filter(
      r =>
        typeof r.row[0] === 'string' &&
        (r.row[0].includes('Results') ||
          r.row[0].includes('Limits') ||
          r.row[0].includes('Indices') ||
          r.row[0].includes('Conformance'))
    );

    for (const section of sectionHeaders) {
      const rowNum = parseInt(startCell.match(/\d+/)?.[0] ?? '1') + section.index;
      const sectionRange = sheet.getRange(`${startCol}${rowNum}:${endCol}${rowNum}`);
      sectionRange.format.font.bold = true;
      sectionRange.format.fill.color = '#f0f0f0';
    }

    await context.sync();
  });
}
