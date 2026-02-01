import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PORT = env.PORT || 3000;
  const BASE_URL = env.VITE_APP_BASE_URL || '/';

  // Construct proxy routes
  const proxyRoutes = {
    '/api': {
      target: `http://127.0.0.1:${PORT}`,
      changeOrigin: true
    }
  };

  // If running in a subdirectory, add a proxy rule for that as well
  if (BASE_URL !== '/') {
    const apiPath = BASE_URL.endsWith('/') ? `${BASE_URL}api` : `${BASE_URL}/api`;
    proxyRoutes[apiPath] = {
      target: `http://127.0.0.1:${PORT}`,
      changeOrigin: true
    };
  }

  return {
    plugins: [react()],
    base: BASE_URL,
    server: {
      proxy: proxyRoutes
    }
  }
})
