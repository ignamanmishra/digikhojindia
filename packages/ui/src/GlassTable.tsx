import React from 'react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface GlassTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function GlassTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  className = '',
}: GlassTableProps<T>) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-white/[0.05] via-[#102B50]/20 to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 font-heading font-semibold uppercase tracking-wider text-[11px]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 ${
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.06]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2 text-cyan-400">
                    <svg
                      className="animate-spin h-5 w-5"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-400 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group transition-all duration-200 ${
                    onRowClick ? 'cursor-pointer' : ''
                  } hover:bg-white/[0.06] hover:shadow-[inset_0_0_15px_rgba(66,221,245,0.06)]`}
                >
                  {columns.map((col, idx) => {
                    const content =
                      typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                        ? (row[col.accessor] as any)
                        : null;

                    return (
                      <td
                        key={idx}
                        className={`py-3.5 px-4 text-slate-200 ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
