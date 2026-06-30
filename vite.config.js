import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  /* server: {
    proxy: {
      "/api": {
        target: "https://erp.eduquity.com",
        changeOrigin: true,
        secure: false, // ignore self-signed SSL issues
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  }, */
});
