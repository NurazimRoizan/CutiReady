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
  let typeLabel = 'KERJA';
  let isDashed = false;

  if (day.type === 'WEEKEND') {
    bgColor = 'var(--weekend-bg)';
    textColor = 'var(--weekend-text)';
    typeLabel = 'WEEKEND';
  } else if (day.type === 'PUBLIC_HOLIDAY') {
    bgColor = 'var(--ph-bg)';
    textColor = 'var(--ph-text)';
    typeLabel = day.holidayName ? `PH: ${day.holidayName.split(' ')[0]}` : 'CUTI PH';
  } else if (day.type === 'REPLACEMENT_HOLIDAY') {
    bgColor = 'var(--accent-cyan)';
    textColor = 'var(--text-color)';
    typeLabel = 'CUTI GANTI';
  } else if (day.type === 'WORKDAY') {
    // This workday is part of the bridge, so it's a recommended / planned AL day!
    bgColor = 'var(--accent-pink)';
    textColor = 'var(--text-color)';
    typeLabel = isPlanned ? '✓ DAH LOCK' : 'AMBIL AL';
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
        flex: '1 0 70px',
        minWidth: '68px',
        maxWidth: '85px',
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
          marginBottom: '0.2rem',
          color: 'var(--text-color)',
        }}
      >
        {dateFormatted}
      </span>
      <span
        style={{
          fontSize: '0.58rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          padding: '0.1rem 0.3rem',
          borderRadius: 'var(--border-radius-pill)',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          maxWidth: '62px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: 'var(--text-color)',
        }}
      >
        {typeLabel}
      </span>
    </div>
  );
}

export const DayStripTile = memo(DayStripTileComponent);

