import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        details: "./sheets.html.html",
      },
    },
  },
});