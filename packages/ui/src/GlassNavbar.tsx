import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeContext';
import { GlassButton } from './GlassButton';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export interface GlassNavbarProps {
  links?: NavLinkItem[];
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  links = [
    { id: 'services', label: 'Services', href: '/services' },
    { id: 'portfolio', label: 'Software Portfolio', href: '/portfolio' },
    { id: 'industries', label: 'Industries', href: '/industries' },
    { id: 'case-studies', label: 'Case Studies', href: '/case-studies' },
    { id: 'blog', label: 'Tech News & Blog', href: '/blog' },
    { id: 'contact', label: 'Contact Us', href: '/contact' },
  ],
  ctaLabel = 'Request Demo',
  ctaHref = '/request-demo',
  onCtaClick,
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#080D20]/75 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* Top subtle liquid gradient line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#287BFF] via-[#42DDF5] to-[#9B70FF]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo with Official Emblem */}
        <a href="/" className="flex items-center gap-2 group">
          <BrandLogo size="md" variant="full" glow={true} />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold select-none transition-all duration-200 ${
                link.isActive
                  ? 'bg-gradient-to-r from-[#287BFF]/40 to-[#42DDF5]/30 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(66,221,245,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA and Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />

          <a href="/login" className="text-xs font-semibold text-slate-300 hover:text-cyan-300 px-3 py-2 transition-colors">
            Client Login
          </a>

          <GlassButton
            size="sm"
            variant="primary"
            onClick={onCtaClick ? onCtaClick : () => (window.location.href = ctaHref)}
          >
            <span>{ctaLabel}</span>
            <ArrowRight size={13} />
          </GlassButton>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-white/10 bg-[#080D20]/95 backdrop-blur-2xl px-4 py-4 space-y-2 overflow-hidden"
          >
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  link.isActive
                    ? 'bg-blue-600/30 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href="/login"
                className="w-full text-center py-2.5 text-xs font-semibold text-slate-200 bg-white/5 rounded-xl border border-white/10"
              >
                Client Login
              </a>
              <GlassButton
                size="md"
                variant="primary"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = ctaHref;
                }}
              >
                <span>{ctaLabel}</span>
                <ArrowRight size={14} />
              </GlassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

