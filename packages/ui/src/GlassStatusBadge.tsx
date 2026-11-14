import React from 'react';

export type StatusType =
  | 'success'
  | 'warning'
  | 'critical'
  | 'pending'
  | 'active'
  | 'info';

export interface GlassStatusBadgeProps {
  status: StatusType | string;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const GlassStatusBadge: React.FC<GlassStatusBadgeProps> = ({
  status,
  label,
  pulse = true,
  size = 'md',
  className = '',
}) => {
  const normalized = (status || '').toLowerCase();

  const getStyle = () => {
    switch (normalized) {
      case 'success':
      case 'resolved':
      case 'won':
      case 'completed':
      case 'paid':
        return {
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/35',
          text: 'text-emerald-300',
          dot: 'bg-emerald-400',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
        };
      case 'warning':
      case 'expiring':
      case 'on hold':
      case 'partial':
      case 'waiting for customer':
        return {
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/35',
          text: 'text-amber-300',
          dot: 'bg-amber-400',
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        };
      case 'critical':
      case 'overdue':
      case 'lost':
      case 'cancelled':
      case 'urgent':
        return {
          bg: 'bg-rose-500/15',
          border: 'border-rose-500/35',
          text: 'text-rose-300',
          dot: 'bg-rose-400',
          glow: 'shadow-[0_0_12px_rgba(244,63,94,0.3)]',
        };
      case 'active':
      case 'open':
      case 'in progress':
      case 'planning':
        return {
          bg: 'bg-cyan-500/15',
          border: 'border-cyan-500/35',
          text: 'text-cyan-300',
          dot: 'bg-cyan-400',
          glow: 'shadow-[0_0_12px_rgba(66,221,245,0.3)]',
        };
      case 'pending':
      case 'new':
      case 'assigned':
        return {
          bg: 'bg-violet-500/15',
          border: 'border-violet-500/35',
          text: 'text-violet-300',
          dot: 'bg-violet-400',
          glow: 'shadow-[0_0_12px_rgba(155,112,255,0.3)]',
        };
      default:
        return {
          bg: 'bg-slate-500/15',
          border: 'border-slate-500/35',
          text: 'text-slate-300',
          dot: 'bg-slate-400',
          glow: 'shadow-none',
        };
    }
  };

  const style = getStyle();
  const displayLabel = label || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full backdrop-blur-md border uppercase tracking-wider font-semibold select-none ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      } ${style.bg} ${style.border} ${style.text} ${style.glow} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${style.dot}`} />
      </span>
      <span>{displayLabel}</span>
    </span>
  );
};
