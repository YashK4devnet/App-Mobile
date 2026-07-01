// vite.config.js
import { defineConfig } from "file:///c:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/vite/dist/node/index.js";
import react from "file:///c:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/@vitejs/plugin-react/dist/index.mjs";
import legacy from "file:///c:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import tailwindcss from "file:///c:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/@tailwindcss/vite/dist/index.mjs";
import dotenv from "file:///c:/Users/rajat/Downloads/App-Mobile/App-Mobile/node_modules/dotenv/lib/main.js";
import path from "path";
var __vite_injected_original_dirname = "c:\\Users\\rajat\\Downloads\\App-Mobile\\App-Mobile";
dotenv.config({ path: path.resolve(__vite_injected_original_dirname, "src/components/audit/.env") });
var ipAddress = process.env.AUDIT_API_IP || "";
var cleanIp = ipAddress.replace(/^(https?:\/\/)?/, "").replace(/\/$/, "");
var proxyTarget = cleanIp ? `http://${cleanIp}` : "http://localhost:8089";
var vite_config_default = defineConfig({
  define: {
    "process.env.AUDIT_API_IP": JSON.stringify(process.env.AUDIT_API_IP)
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
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
        // ignore self-signed SSL issues
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxyYWphdFxcXFxEb3dubG9hZHNcXFxcQXBwLU1vYmlsZVxcXFxBcHAtTW9iaWxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxyYWphdFxcXFxEb3dubG9hZHNcXFxcQXBwLU1vYmlsZVxcXFxBcHAtTW9iaWxlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9jOi9Vc2Vycy9yYWphdC9Eb3dubG9hZHMvQXBwLU1vYmlsZS9BcHAtTW9iaWxlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgbGVnYWN5IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1sZWdhY3lcIjtcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbi8vIExvYWQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGZyb20gdGhlIGF1ZGl0IGZlYXR1cmUgZGlyZWN0b3J5XHJcbmRvdGVudi5jb25maWcoeyBwYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9jb21wb25lbnRzL2F1ZGl0Ly5lbnZcIikgfSk7XHJcblxyXG5jb25zdCBpcEFkZHJlc3MgPSBwcm9jZXNzLmVudi5BVURJVF9BUElfSVAgfHwgXCJcIjtcclxuY29uc3QgY2xlYW5JcCA9IGlwQWRkcmVzcy5yZXBsYWNlKC9eKGh0dHBzPzpcXC9cXC8pPy8sIFwiXCIpLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcclxuY29uc3QgcHJveHlUYXJnZXQgPSBjbGVhbklwID8gYGh0dHA6Ly8ke2NsZWFuSXB9YCA6IFwiaHR0cDovL2xvY2FsaG9zdDo4MDg5XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGRlZmluZToge1xyXG4gICAgXCJwcm9jZXNzLmVudi5BVURJVF9BUElfSVBcIjogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuQVVESVRfQVBJX0lQKSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbGVnYWN5KHtcclxuICAgICAgdGFyZ2V0czogW1wiZGVmYXVsdHNcIiwgXCJub3QgSUUgMTFcIl0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgXCIvYXBpXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IHByb3h5VGFyZ2V0LFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLCAvLyBpZ25vcmUgc2VsZi1zaWduZWQgU1NMIGlzc3Vlc1xyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1UsU0FBUyxvQkFBb0I7QUFDclcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxVQUFVO0FBTGpCLElBQU0sbUNBQW1DO0FBUXpDLE9BQU8sT0FBTyxFQUFFLE1BQU0sS0FBSyxRQUFRLGtDQUFXLDJCQUEyQixFQUFFLENBQUM7QUFFNUUsSUFBTSxZQUFZLFFBQVEsSUFBSSxnQkFBZ0I7QUFDOUMsSUFBTSxVQUFVLFVBQVUsUUFBUSxtQkFBbUIsRUFBRSxFQUFFLFFBQVEsT0FBTyxFQUFFO0FBQzFFLElBQU0sY0FBYyxVQUFVLFVBQVUsT0FBTyxLQUFLO0FBRXBELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLDRCQUE0QixLQUFLLFVBQVUsUUFBUSxJQUFJLFlBQVk7QUFBQSxFQUNyRTtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsWUFBWTtBQUFBLElBQ1osTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLFlBQVksV0FBVztBQUFBLElBQ25DLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUE7QUFBQSxRQUNSLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzlDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
