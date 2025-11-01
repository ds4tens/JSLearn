import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporter: ['verbose', 'dot'],

    
    silent: false,
    
    outputDiffMaxSize: 10000,
    outputDiffLines: 75,
    
    outputColor: true,
    
    globals: true,
    
    // Покрытие кода
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text', 'text-summary', 'html', 'json'],
    //   exclude: [
    //     'node_modules/',
    //     '**/__tests__/**',
    //     '**/*.config.js',
    //     '**/data.js',
    //   ],
    //   thresholds: {
    //     lines: 80,
    //     functions: 80,
    //     branches: 80,
    //     statements: 80,
    //   },
    //   reportOnFailure: true,
    // },
    
    testTimeout: 10000,
    hookTimeout: 10000,
    
    environment: 'node',
    
    threads: true,
    maxConcurrency: 3,
    
    retry: 0, 
    bail: 0,
    
    sourcemap: true,
    
    showSeed: true,
    
    notify: false,
  },
});
