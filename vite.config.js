import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the built site work on GitHub Pages (we use HashRouter too).
export default defineConfig({ plugins: [react()], base: './' });