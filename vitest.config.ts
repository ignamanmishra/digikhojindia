import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      '@digikhojindia/shared': path.resolve(__dirname, './packages/shared/src/index.ts'),
      '@digikhojindia/validation': path.resolve(__dirname, './packages/validation/src/index.ts'),
      '@digikhojindia/types': path.resolve(__dirname, './packages/types/src/index.ts'),
      '@digikhojindia/database': path.resolve(__dirname, './packages/database/src/index.ts'),
      '@digikhojindia/ui': path.resolve(__dirname, './packages/ui/src/index.ts'),
    },
  },
});

