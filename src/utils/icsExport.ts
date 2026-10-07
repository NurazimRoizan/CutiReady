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
