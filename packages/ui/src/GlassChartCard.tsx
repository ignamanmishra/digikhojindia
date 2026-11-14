import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface GlassChartCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  changePercent?: number;
  changePeriod?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const GlassChartCard: React.FC<GlassChartCardProps> = ({
  title,
  subtitle,
  value,
  changePercent,
  changePeriod = 'vs last month',
  action,
  children,
  className = '',
}) => {
  const isPositive = changePercent !== undefined && changePercent >= 0;

  return (
    <GlassCard glowColor="cyan" className={`space-y-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-400 font-heading uppercase tracking-wider">
            {title}
          </h4>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
          {value !== undefined && (
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-black text-white font-heading tracking-tight">
                {value}
              </span>
              {changePercent !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isPositive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{isPositive ? `+${changePercent}%` : `${changePercent}%`}</span>
                </span>
              )}
            </div>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="pt-2">{children}</div>
    </GlassCard>
  );
};
