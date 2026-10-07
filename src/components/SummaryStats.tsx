import { BridgeOpportunity } from '../types';
import { Calendar, Flame, Zap, Award } from 'lucide-react';

interface SummaryStatsProps {
  bridges: BridgeOpportunity[];
  plannedLeaveDates: string[];
}

export function SummaryStats({ bridges, plannedLeaveDates }: SummaryStatsProps) {
  const totalBridges = bridges.length;
  const freeBridges = bridges.filter((b) => b.alDaysRequired === 0).length;
  const maxBreak = bridges.reduce((max, b) => Math.max(max, b.totalDaysOff), 0);

  // Calculate total contiguous days off user has secured via their planned leave dates
  // Find all bridges where user has fully planned the required leave
  const plannedBridges = bridges.filter(
    (b) =>
      b.alDaysRequired > 0 &&
      b.annualLeaveDates.every((d) => plannedLeaveDates.includes(d))
  );

  const stats = [
    {
      label: 'TOTAL BRIDGES',
      value: totalBridges,
      subtext: 'Opportunities',
      color: 'var(--accent-yellow)',
      icon: Calendar,
    },
    {
      label: 'FREE (0 AL)',
      value: freeBridges,
      subtext: 'Natural Breaks',
      color: 'var(--accent-cyan)',
      icon: Zap,
    },
    {
      label: 'MAX BREAK',
      value: `${maxBreak}d`,
      subtext: 'Contiguous',
      color: 'var(--accent-green)',
      icon: Flame,
    },
    {
      label: 'LOCKED IN',
      value: `${plannedBridges.length} / ${plannedLeaveDates.length}d`,
      subtext: 'Bridges / AL',
      color: 'var(--accent-pink)',
      icon: Award,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        marginBottom: '1rem',
      }}
    >
      {stats.map((item, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: 'var(--border-width) solid var(--border-color)',
            borderRadius: 'var(--border-radius)',
            padding: '0.65rem 0.75rem',
            boxShadow: 'var(--shadow-offset) var(--shadow-offset) 0px var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.2rem',
            }}
          >
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: 'var(--text-muted)',
              }}
            >
              {item.label}
            </span>
            <div
              style={{
                backgroundColor: item.color,
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--border-radius-pill)',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <item.icon size={12} strokeWidth={2.5} color="var(--border-color)" />
            </div>
          </div>

          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              color: 'var(--text-color)',
            }}
          >
            {item.value}
          </div>

          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginTop: '0.15rem',
            }}
          >
            {item.subtext}
          </span>
        </div>
      ))}
    </div>
  );
}
