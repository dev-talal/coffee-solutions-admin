import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: [
              'axios',
              'zod',
              'recharts',
              'react-hook-form',
              'date-fns',
              'react-i18next',
              'react-pdf',
              'react-international-phone',
              'google-libphonenumber',
            ],
          },
        },
      },
    },
  });
};
