import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Redireciona todas as rotas para index.html
  },
  base: "./", // 🔹 Corrige o carregamento dos arquivos no HostGator
})

