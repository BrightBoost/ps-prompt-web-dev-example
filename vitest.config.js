import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setupTests.js'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    }
  },
});
