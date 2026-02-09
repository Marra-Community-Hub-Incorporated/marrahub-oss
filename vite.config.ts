import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { networkInterfaces } from 'os'

// Function to find the local 192.168.0.x IP address
const getLocalIp = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      // Look for IPv4, non-internal, and starts with 192.168.0
      if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192.168.0.')) {
        return net.address;
      }
    }
  }
  return 'localhost'; // Fallback
};

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: getLocalIp(),
    port: 5173,
    strictPort: true,
  },
  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
