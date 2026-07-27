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
var cleanIp = ipAddress.replace(/\/$/, "");
var proxyTarget = cleanIp ? cleanIp.startsWith("http") ? cleanIp : `http://${cleanIp}` : "http://localhost:8099";
var vite_config_default = defineConfig({
  define: {
    "process.env.AUDIT_API_IP": JSON.stringify(process.env.AUDIT_API_IP),
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
    "process.env.AUDIT_API_DB": JSON.stringify(process.env.AUDIT_API_DB)
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
      },
      "/odoo_connect": {
        target: proxyTarget.replace(/\/api$/, ""),
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxyYWphdFxcXFxEb3dubG9hZHNcXFxcQXBwLU1vYmlsZVxcXFxBcHAtTW9iaWxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxyYWphdFxcXFxEb3dubG9hZHNcXFxcQXBwLU1vYmlsZVxcXFxBcHAtTW9iaWxlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9jOi9Vc2Vycy9yYWphdC9Eb3dubG9hZHMvQXBwLU1vYmlsZS9BcHAtTW9iaWxlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgbGVnYWN5IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1sZWdhY3lcIjtcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbi8vIExvYWQgZW52aXJvbm1lbnQgdmFyaWFibGVzIGZyb20gdGhlIGF1ZGl0IGZlYXR1cmUgZGlyZWN0b3J5XHJcbmRvdGVudi5jb25maWcoeyBwYXRoOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9jb21wb25lbnRzL2F1ZGl0Ly5lbnZcIikgfSk7XHJcblxyXG5jb25zdCBpcEFkZHJlc3MgPSBwcm9jZXNzLmVudi5BVURJVF9BUElfSVAgfHwgXCJcIjtcclxuY29uc3QgY2xlYW5JcCA9IGlwQWRkcmVzcy5yZXBsYWNlKC9cXC8kLywgXCJcIik7XHJcbmNvbnN0IHByb3h5VGFyZ2V0ID0gY2xlYW5JcCBcclxuICA/IChjbGVhbklwLnN0YXJ0c1dpdGgoXCJodHRwXCIpID8gY2xlYW5JcCA6IGBodHRwOi8vJHtjbGVhbklwfWApIFxyXG4gIDogXCJodHRwOi8vbG9jYWxob3N0OjgwOTlcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgZGVmaW5lOiB7XHJcbiAgICBcInByb2Nlc3MuZW52LkFVRElUX0FQSV9JUFwiOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5BVURJVF9BUElfSVApLFxyXG4gICAgXCJpbXBvcnQubWV0YS5lbnYuVklURV9BUElfVVJMXCI6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlZJVEVfQVBJX1VSTCksXHJcbiAgICBcInByb2Nlc3MuZW52LkFVRElUX0FQSV9EQlwiOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5BVURJVF9BUElfREIpLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdGFpbHdpbmRjc3MoKSxcclxuICAgIHJlYWN0KCksXHJcbiAgICBsZWdhY3koe1xyXG4gICAgICB0YXJnZXRzOiBbXCJkZWZhdWx0c1wiLCBcIm5vdCBJRSAxMVwiXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgIHRhcmdldDogcHJveHlUYXJnZXQsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsIC8vIGlnbm9yZSBzZWxmLXNpZ25lZCBTU0wgaXNzdWVzXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBcIi9vZG9vX2Nvbm5lY3RcIjoge1xyXG4gICAgICAgIHRhcmdldDogcHJveHlUYXJnZXQucmVwbGFjZSgvXFwvYXBpJC8sIFwiXCIpLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VSxTQUFTLG9CQUFvQjtBQUNyVyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFVBQVU7QUFMakIsSUFBTSxtQ0FBbUM7QUFRekMsT0FBTyxPQUFPLEVBQUUsTUFBTSxLQUFLLFFBQVEsa0NBQVcsMkJBQTJCLEVBQUUsQ0FBQztBQUU1RSxJQUFNLFlBQVksUUFBUSxJQUFJLGdCQUFnQjtBQUM5QyxJQUFNLFVBQVUsVUFBVSxRQUFRLE9BQU8sRUFBRTtBQUMzQyxJQUFNLGNBQWMsVUFDZixRQUFRLFdBQVcsTUFBTSxJQUFJLFVBQVUsVUFBVSxPQUFPLEtBQ3pEO0FBRUosSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sNEJBQTRCLEtBQUssVUFBVSxRQUFRLElBQUksWUFBWTtBQUFBLElBQ25FLGdDQUFnQyxLQUFLLFVBQVUsUUFBUSxJQUFJLFlBQVk7QUFBQSxJQUN2RSw0QkFBNEIsS0FBSyxVQUFVLFFBQVEsSUFBSSxZQUFZO0FBQUEsRUFDckU7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFNBQVMsQ0FBQyxZQUFZLFdBQVc7QUFBQSxJQUNuQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBO0FBQUEsUUFDUixTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM5QztBQUFBLE1BQ0EsaUJBQWlCO0FBQUEsUUFDZixRQUFRLFlBQVksUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUN4QyxjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
