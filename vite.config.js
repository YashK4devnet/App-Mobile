import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // HARDCODED AS REQUESTED BY USER FOR LOCAL CORS BYPASS
  const baseUrl = "http://192.168.29.67:4955";

  return {
    define: {
      "process.env.AUDIT_API_IP": JSON.stringify(env.AUDIT_API_IP),
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
      "process.env.AUDIT_API_DB": JSON.stringify(env.VITE_API_DB),
      ...(command === 'serve' ? { "import.meta.env.VITE_API_BASE_URL": JSON.stringify("/api") } : {})
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
        "/api/audits": {
          target: baseUrl,
          changeOrigin: true,
          secure: false,
        },
        "/api": {
          target: baseUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/odoo_connects": {
          target: baseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
