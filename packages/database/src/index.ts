/**
 * DIGIKHOJINDIA DATABASE MODULE
 * Owner: Naman Mishra
 * Platform: Digikhojindia
 */

export interface D1DatabaseResult<T = unknown> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1DatabaseResult<T>>;
  run<T = unknown>(): Promise<D1DatabaseResult<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1DatabaseResult<T>[]>;
  exec<T = unknown>(query: string): Promise<D1DatabaseResult<T>>;
}

export const MIGRATION_FILE = '0001_initial_schema.sql';
export const SEED_FILE = 'seed.sql';
