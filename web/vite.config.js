import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react' // если используете React

export default defineConfig(({ command, mode }) => {
  // Загружаем переменные окружения
  // Третий параметр '' загружает все переменные, а не только с VITE_
  const env = loadEnv(mode, process.cwd(), '')
  
  // Определяем, dev-режим или нет
  const isDev = mode === 'development'
  
  // Преобразуем порт в число
  const port = parseInt(env.VITE_PORT) || 3000
  
  return {
    plugins: [
      react(),
    ],
    
    server: {
      host: env.VITE_HOST,
      port: port,
      strictPort: true,
      open: false,
      
      proxy: isDev ? {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      } : undefined,
    },
    
    preview: {
      host: 'localhost',
      port: 4173,
      strictPort: true,
    },
    
    define: {
      __APP_ENV__: JSON.stringify(env.NODE_ENV || mode),
    },
  }
})