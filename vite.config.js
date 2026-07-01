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
const proxyTarget = cleanIp ? `http://${cleanIp}` : "http://localhost:8089";

export default defineConfig({
  define: {
    "process.env.AUDIT_API_IP": JSON.stringify(process.env.AUDIT_API_IP),
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
    },
  },
});
