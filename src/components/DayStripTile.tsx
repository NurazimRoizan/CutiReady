import { memo } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarDay } from '../types';

export interface DayStripTileProps {
  day: CalendarDay;
  isPlanned?: boolean;
  onTogglePlanned?: () => void;
}

function DayStripTileComponent({
  day,
  isPlanned = false,
  onTogglePlanned,
}: DayStripTileProps) {
  const parsed = parseISO(day.date);
  const dayName = format(parsed, 'EEE'); // Fri, Sat, Sun, etc.
  const dateFormatted = format(parsed, 'd MMM'); // 20 Mar

  let bgColor = 'var(--workday-bg)';
  let textColor = 'var(--workday-text)';
  let pillLine1 = 'HARI';
  let pillLine2 = 'KERJA';
  let isDashed = false;

  if (day.type === 'WEEKEND') {
    bgColor = 'var(--weekend-bg)';
    textColor = 'var(--weekend-text)';
    pillLine1 = 'WEEK';
    pillLine2 = 'END';
  } else if (day.type === 'PUBLIC_HOLIDAY') {
    bgColor = 'var(--ph-bg)';
    textColor = 'var(--ph-text)';
    pillLine1 = 'PUBLIC';
    pillLine2 = 'HOLIDAY';
  } else if (day.type === 'REPLACEMENT_HOLIDAY') {
    bgColor = 'var(--replacement-bg)';
    textColor = 'var(--replacement-text)';
    pillLine1 = 'CUTI';
    pillLine2 = 'GANTI';
  } else if (day.type === 'WORKDAY') {
    // This workday is part of the bridge, so it's a recommended / planned AL day!
    bgColor = 'var(--al-bg)';
    textColor = 'var(--al-text)';
    if (isPlanned) {
      pillLine1 = 'DAH';
      pillLine2 = 'LOCK';
    } else {
      pillLine1 = 'AMBIL';
      pillLine2 = 'AL';
    }
    isDashed = !isPlanned;
  }

  const borderStyle = isDashed
    ? '2px dashed var(--border-color)'
    : '2px solid var(--border-color)';

  const fullHolidayTitle = day.holidayName || (day.type === 'WORKDAY' ? 'Annual Leave Day' : day.type);

  return (
    <div
      onClick={day.type === 'WORKDAY' && onTogglePlanned ? onTogglePlanned : undefined}
      title={`${day.date} (${dayName}): ${fullHolidayTitle}`}
      style={{
        flex: '1 0 68px',
        minWidth: '66px',
        maxWidth: '82px',
        backgroundColor: bgColor,
        color: textColor,
        border: borderStyle,
        borderRadius: 'var(--border-radius-sm)',
        padding: '0.45rem 0.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: day.type === 'WORKDAY' && onTogglePlanned ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.1s ease',
        boxShadow: '1px 1px 0px var(--border-color)',
      }}
    >
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {dayName}
      </span>
      <span
        style={{
          fontSize: '0.85rem',
          fontWeight: 900,
          lineHeight: 1.1,
          marginTop: '0.1rem',
          marginBottom: '0.25rem',
          color: 'var(--text-color)',
        }}
      >
        {dateFormatted}
      </span>
      <div
        style={{
          fontSize: '0.54rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.2px',
          padding: '0.15rem 0.2rem',
          borderRadius: 'var(--border-radius-sm)',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          width: '100%',
          boxSizing: 'border-box',
          color: 'var(--text-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1.15,
        }}
      >
        <span>{pillLine1}</span>
        <span>{pillLine2}</span>
      </div>
    </div>
  );
}

export const DayStripTile = memo(DayStripTileComponent);

