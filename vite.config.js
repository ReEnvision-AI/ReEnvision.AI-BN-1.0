import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactNativeWeb from 'vite-plugin-react-native-web';


export default defineConfig({
  plugins: [reactNativeWeb(), react()],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  server: {
    port: 8000,
    strictPort: true,
    host: true,
    hmr: {
      clientPort: 443,
      path: 'hmr/',
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    https: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
