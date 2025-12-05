import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
        proxy: {
            '/auth': 'http://localhost:5000',
            '/habits': 'http://localhost:5000'
        }
    },
    preview: {
        port: 3000,
        host: true
    }
})
