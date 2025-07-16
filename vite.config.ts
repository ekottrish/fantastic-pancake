import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [
      react({
        // Include .js files for JSX
        include: "**/*.{jsx,tsx,js,ts}",
      }),
    ],
    
    // Environment variables configuration
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    // Path resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    // Development server configuration
    server: {
      port: 3000,
      open: true,
      cors: true,
    },
    
    // Build optimization
    build: {
      outDir: 'dist',
      sourcemap: true,
      // Enable tree shaking
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            motion: ['framer-motion'],
            supabase: ['@supabase/supabase-js'],
            genai: ['@google/genai'],
          },
        },
      },
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        '@supabase/supabase-js',
        '@google/genai',
      ],
    },
  };
});
