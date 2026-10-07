import { addDays, format, parseISO } from 'date-fns';
import { BridgeOpportunity } from '../types';

/**
 * Generates and triggers download of an RFC 5545 .ics calendar event
 * for a specific long weekend leave window (zero external dependencies).
 */
export function generateBridgeICS(bridge: BridgeOpportunity): void {
  const start = bridge.startDate.replace(/-/g, '');

  // RFC 5545 DATE value for multi-day events has an exclusive DTEND
  // Add 1 day to ensure the final day is fully included on calendar clients
  const endExclusiveDate = addDays(parseISO(bridge.endDate), 1);
  const endFormatted = format(endExclusiveDate, 'yyyyMMdd');

  const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const alDescription =
    bridge.alDaysRequired > 0
      ? `AL Dates to apply: ${bridge.annualLeaveDates.join(', ')}`
      : 'Natural Long Weekend (0 AL needed!)';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CutiReady//MY Holiday Arbitrage//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${bridge.id}@cutiready.my`,
    `DTSTAMP:${nowIso}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${endFormatted}`,
    `SUMMARY:🌴 Cuti: ${bridge.title}`,
    `DESCRIPTION:Total ${bridge.totalDaysOff} days off by applying ${bridge.alDaysRequired} days AL.\\n${alDescription}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${bridge.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a unified .ics file containing ALL planned breaks.
 */
export function generateFullPlanICS(bridges: BridgeOpportunity[], stateName: string): void {
  if (bridges.length === 0) return;

  const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const events = bridges.map((bridge) => {
    const start = bridge.startDate.replace(/-/g, '');
    const endExclusiveDate = addDays(parseISO(bridge.endDate), 1);
    const endFormatted = format(endExclusiveDate, 'yyyyMMdd');
    const alDescription =
      bridge.alDaysRequired > 0
        ? `AL Dates to apply: ${bridge.annualLeaveDates.join(', ')}`
        : 'Natural Long Weekend (0 AL needed!)';

    return [
      'BEGIN:VEVENT',
      `UID:${bridge.id}-plan@cutiready.my`,
      `DTSTAMP:${nowIso}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${endFormatted}`,
      `SUMMARY:🌴 Cuti: ${bridge.title}`,
      `DESCRIPTION:${bridge.totalDaysOff} days off (${bridge.alDaysRequired} AL days applied).\\n${alDescription}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//CutiReady//MY Holiday Plan (${stateName})//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `CutiReady-2026-Holiday-Plan.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats a clean leave justification snippet and copies it to the user's clipboard.
 */
export function copyLeaveTextToClipboard(bridge: BridgeOpportunity): Promise<void> {
  const alText =
    bridge.alDaysRequired > 0
      ? bridge.annualLeaveDates.join(', ')
      : 'None (Natural Long Weekend)';

  const text = [
    `🌴 Annual Leave Request: ${bridge.title}`,
    `🗓️ Dates: ${bridge.startDate} to ${bridge.endDate} (${bridge.totalDaysOff} consecutive days off)`,
    `📝 Annual Leave to Apply (${bridge.alDaysRequired} day${bridge.alDaysRequired === 1 ? '' : 's'}): ${alText}`,
    `Generated with CutiReady (cutiready.my)`,
  ].join('\n');

  return navigator.clipboard.writeText(text);
}

/**
 * Formats a comprehensive leave schedule of all planned breaks to the clipboard.
 */
export function copyFullPlanToClipboard(bridges: BridgeOpportunity[], stateName: string): Promise<void> {
  const totalAl = bridges.reduce((acc, b) => acc + b.alDaysRequired, 0);
  const totalOff = bridges.reduce((acc, b) => acc + b.totalDaysOff, 0);

  const lines = [
    `🇲🇾 2026 ANNUAL LEAVE & HOLIDAY PLAN (${stateName})`,
    `Total Long Weekends Planned: ${bridges.length}`,
    `Total Consecutive Days Off: ${totalOff} days`,
    `Total Annual Leave (AL) Days Required: ${totalAl} days`,
    `--------------------------------------------------`,
    ...bridges.map((b, i) => {
      const alStr = b.alDaysRequired > 0 ? `Apply AL on: ${b.annualLeaveDates.join(', ')}` : '0 AL needed (Public Holiday)';
      return `${i + 1}. ${b.title}\n   📅 ${b.startDate} → ${b.endDate} (${b.totalDaysOff} days off)\n   🏖️ ${alStr}`;
    }),
    `--------------------------------------------------`,
    `Optimized via CutiReady (cutiready.my)`,
  ];

  return navigator.clipboard.writeText(lines.join('\n'));
}
