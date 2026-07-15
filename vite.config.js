import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the audit feature directory
dotenv.config({ path: path.resolve(__dirname, "src/components/audit/.env") });

const ipAddress = process.env.AUDIT_API_IP || "";
const cleanIp = ipAddress.replace(/^(https?:\/\/)?/, "").replace(/\/$/, "");
const proxyTarget = cleanIp ? `http://${cleanIp}` : "http://localhost:8099";

export default defineConfig({
  define: {
    "process.env.AUDIT_API_IP": JSON.stringify(process.env.AUDIT_API_IP),
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
    "process.env.AUDIT_API_DB": JSON.stringify(process.env.AUDIT_API_DB),
  },
  plugins: [
    tailwindcss(),
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
        secure: false, // ignore self-signed SSL issues
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/odoo_connect": {
        target: proxyTarget.replace(/\/api$/, ""),
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
