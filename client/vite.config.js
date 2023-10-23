import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 8081, // you can replace this port with any port
  },
  resolve: {
    alias: [
      {
        find: "@components",
        replacement: "/src/components",
      },
      {
        find: "@hooks",
        replacement: "/src/hooks",
      },
      {
        find: "@database",
        replacement: "/src/database",
      },
      {
        find: "@context",
        replacement: "/src/context",
      },
      {
        find: "@store",
        replacement: "/src/store",
      },
    ],
  },
});
