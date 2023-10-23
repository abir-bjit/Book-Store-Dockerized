import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
