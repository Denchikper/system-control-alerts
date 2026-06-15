import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Плагин включает автоматический JSX-runtime, поэтому импорт React в каждом файле не требуется.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});
