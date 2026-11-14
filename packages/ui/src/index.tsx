/**
 * DIGIKHOJINDIA LIQUID GLASS UI DESIGN SYSTEM
 * Inspired by OnePlus ColorOS Liquid Glass:
 * Fluid motion, translucent layered surfaces, dynamic gradients, luminous effects
 * Owner: Naman Mishra
 */

export * from './BrandLogo';
export * from './ThemeContext';
export * from './GlassButton';
export * from './GlassCard';
export * from './GlassInput';
export * from './GlassModal';
export * from './GlassDropdown';
export * from './GlassStatusBadge';
export * from './GlassTabs';
export * from './GlassTable';
export * from './GlassNotification';
export * from './GlassChartCard';
export * from './GlassFloatingActionButton';
export * from './GlassSearchBar';
export * from './GlassNavbar';
export * from './GlassSidebar';

// Legacy compatibility exports (aliased to enhanced Liquid Glass primitives)
export { GlassButton as Button } from './GlassButton';
export { GlassCard as Card } from './GlassCard';
export { GlassInput as Input } from './GlassInput';
export { GlassModal as Modal } from './GlassModal';
export { GlassStatusBadge as Badge } from './GlassStatusBadge';

// Legacy StatCard with liquid glass upgrade
import React from 'react';
import { GlassCard } from './GlassCard';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  className = '',
}) => {
  return (
    <GlassCard glowColor="cyan" interactive={true} className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 font-heading uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(66,221,245,0.2)]">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-black text-white font-heading tracking-tight">{value}</div>
        {trend && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span
              className={
                trend.isPositive
                  ? 'text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20'
                  : 'text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20'
              }
            >
              {trend.value}
            </span>
            {description && <span className="text-slate-500">{description}</span>}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
