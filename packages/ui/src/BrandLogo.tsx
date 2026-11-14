import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  withTagline?: boolean;
  className?: string;
  glow?: boolean;
}

/**
 * DIGIKHOJINDIA OFFICIAL BRAND LOGO
 * Styled according to the official trademark emblem:
 * - Metallic 3D "D" with magnifying glass & bar chart
 * - Dynamic saffron/orange "K" monogram
 * - Orbital gradient swoosh (saffron-white-emerald) with digital tech blocks
 * - DigiKhojIndia typography
 * - Official Hindi brand line: "Technology की हर नई खोज, आपके लिए!"
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  withTagline = true,
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]' },
    md: { img: 'w-10 h-10', text: 'text-lg', sub: 'text-[10px]' },
    lg: { img: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem / Icon with Glowing Outer Liquid Glass Ring */}
      <div
        className={`relative rounded-full p-0.5 shrink-0 ${sizeMap.img} ${
          glow ? 'shadow-[0_0_20px_rgba(66,221,245,0.4)]' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #F078C8 0%, #287BFF 30%, #42DDF5 70%, #10B981 100%)',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#080D20] p-1 flex items-center justify-center overflow-hidden border border-white/20">
          <img
            src="/logo.png"
            alt="DigiKhojIndia Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            onError={(e) => {
              // Fallback SVG representation if logo.png is loading
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.svg-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'svg-fallback text-xs font-black text-white flex items-center justify-center';
                fallback.innerHTML = '<span class="text-white">D</span><span class="text-orange-500">K</span>';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>

        {/* Ambient neon pulse ring */}
        {glow && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-500/20 to-orange-500/20 blur-sm pointer-events-none -z-10 animate-pulse-slow" />
        )}
      </div>

      {/* Typography Section */}
      {variant === 'full' && (
        <div className="flex flex-col justify-center text-left leading-tight">
          <div className={`font-black tracking-tight ${sizeMap.text} font-heading flex items-center`}>
            <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">DigiKhoj</span>
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(249,115,22,0.4)]">
              India
            </span>
          </div>

          {withTagline && (
            <div className={`text-slate-400 font-medium tracking-wide ${sizeMap.sub} italic mt-0.5`}>
              <span className="text-slate-300">Technology</span> की हर नई खोज, <span className="text-cyan-400 font-semibold">आपके लिए!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
