import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: "src/main.jsx",
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.includes("main.css")) return "assets/index.css";
          if (assetInfo.name === "main.css") return "assets/index.css";
          return "assets/[name][extname]";
        },
        chunkFileNames: "assets/[name].js",
        entryFileNames: "assets/index.js",
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
