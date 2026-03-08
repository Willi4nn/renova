import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const BACKEND_URL = 'http://192.168.100.2:3333';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Todas as requests /api são proxied para o backend
      // O browser vê sempre a mesma origem → cookies funcionam
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Remover o atributo Domain e normaliza SameSite do cookie para que o
            // browser guarde o cookie para o domínio do Vite (localhost ou IP da rede)
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*Domain=[^;]*/i, '')
                  .replace(/SameSite=Strict/i, 'SameSite=Lax'),
              );
            }
          });
        },
      },
    },
  },
});
