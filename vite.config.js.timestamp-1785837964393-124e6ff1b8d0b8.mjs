// vite.config.js
import { defineConfig, loadEnv } from "file:///C:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/@vitejs/plugin-react/dist/index.mjs";
import legacy from "file:///C:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import tailwindcss from "file:///C:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = env.VITE_API_BASE_URL || "https://erp.eduquity.com";
  return {
    define: {
      "process.env.AUDIT_API_IP": JSON.stringify(env.AUDIT_API_IP),
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
      "process.env.AUDIT_API_DB": JSON.stringify(env.VITE_API_DB),
      ...command === "serve" ? { "import.meta.env.VITE_API_BASE_URL": JSON.stringify("/api") } : {}
    },
    plugins: [
      tailwindcss(),
      react(),
      legacy({
        targets: ["defaults", "not IE 11"]
      })
    ],
    server: {
      proxy: {
        "/api/audits": {
          target: baseUrl,
          changeOrigin: true,
          secure: false
        },
        "/api": {
          target: baseUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
        "/odoo_connects": {
          target: baseUrl,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyYWphdFxcXFxEb3dubG9hZHNcXFxcQXBwLU1vYmlsZVxcXFxBcHAtTW9iaWxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyYWphdFxcXFxEb3dubG9hZHNcXFxcQXBwLU1vYmlsZVxcXFxBcHAtTW9iaWxlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9yYWphdC9Eb3dubG9hZHMvQXBwLU1vYmlsZS9BcHAtTW9iaWxlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgbGVnYWN5IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1sZWdhY3lcIjtcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xyXG4gIFxyXG4gIC8vIER5bmFtaWNhbGx5IGxvYWQgYmFzZSBVUkwgZnJvbSAuZW52IGZpbGUgdG8gc3VwcG9ydCBQaW5nZ3kvV0ZIIHdpdGhvdXQgaGFyZGNvZGluZ1xyXG4gIGNvbnN0IGJhc2VVcmwgPSBlbnYuVklURV9BUElfQkFTRV9VUkwgfHwgXCJodHRwczovL2VycC5lZHVxdWl0eS5jb21cIjtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGRlZmluZToge1xyXG4gICAgICBcInByb2Nlc3MuZW52LkFVRElUX0FQSV9JUFwiOiBKU09OLnN0cmluZ2lmeShlbnYuQVVESVRfQVBJX0lQKSxcclxuICAgICAgXCJpbXBvcnQubWV0YS5lbnYuVklURV9BUElfVVJMXCI6IEpTT04uc3RyaW5naWZ5KGVudi5WSVRFX0FQSV9VUkwpLFxyXG4gICAgICBcInByb2Nlc3MuZW52LkFVRElUX0FQSV9EQlwiOiBKU09OLnN0cmluZ2lmeShlbnYuVklURV9BUElfREIpLFxyXG4gICAgICAuLi4oY29tbWFuZCA9PT0gJ3NlcnZlJyA/IHsgXCJpbXBvcnQubWV0YS5lbnYuVklURV9BUElfQkFTRV9VUkxcIjogSlNPTi5zdHJpbmdpZnkoXCIvYXBpXCIpIH0gOiB7fSlcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICAgIHJlYWN0KCksXHJcbiAgICAgIGxlZ2FjeSh7XHJcbiAgICAgICAgdGFyZ2V0czogW1wiZGVmYXVsdHNcIiwgXCJub3QgSUUgMTFcIl0sXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgIFwiL2FwaS9hdWRpdHNcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBiYXNlVXJsLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGJhc2VVcmwsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCIvb2Rvb19jb25uZWN0c1wiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGJhc2VVcmwsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdVLFNBQVMsY0FBYyxlQUFlO0FBQzlXLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxpQkFBaUI7QUFFeEIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUNqRCxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFHM0MsUUFBTSxVQUFVLElBQUkscUJBQXFCO0FBRXpDLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLDRCQUE0QixLQUFLLFVBQVUsSUFBSSxZQUFZO0FBQUEsTUFDM0QsZ0NBQWdDLEtBQUssVUFBVSxJQUFJLFlBQVk7QUFBQSxNQUMvRCw0QkFBNEIsS0FBSyxVQUFVLElBQUksV0FBVztBQUFBLE1BQzFELEdBQUksWUFBWSxVQUFVLEVBQUUscUNBQXFDLEtBQUssVUFBVSxNQUFNLEVBQUUsSUFBSSxDQUFDO0FBQUEsSUFDL0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFlBQVk7QUFBQSxNQUNaLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyxZQUFZLFdBQVc7QUFBQSxNQUNuQyxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsZUFBZTtBQUFBLFVBQ2IsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxVQUNSLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLFFBQ0Esa0JBQWtCO0FBQUEsVUFDaEIsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
