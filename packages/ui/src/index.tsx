/**
 * DIGIKHOJINDIA REUSABLE UI DESIGN SYSTEM
 * Navy & Blue Premium SaaS Palette
 * Owner: Naman Mishra
 */

import React from 'react';

// ==========================================
// 1. Button Component
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size];

  const variantClasses = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500 border border-transparent',
    secondary:
      'bg-slate-800 hover:bg-slate-900 text-white shadow-sm focus:ring-slate-700 border border-transparent',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-blue-500',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500 border border-transparent',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-400',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

// ==========================================
// 2. Badge Component
// ==========================================
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size];

  const variantClasses = {
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
    red: 'bg-rose-50 text-rose-700 border border-rose-200',
    purple: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full uppercase tracking-wider ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

// ==========================================
// 3. Card Component
// ==========================================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

// ==========================================
// 4. StatCard / Metric KPI Card
// ==========================================
export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-medium ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};

// ==========================================
// 5. Input, Select & Form Controls
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
            : 'border-slate-300 focus:border-blue-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

// ==========================================
// 6. Modal Component
// ==========================================
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
