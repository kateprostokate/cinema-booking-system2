import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/cinema-booking-system2/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '.',
    },
  },
});
