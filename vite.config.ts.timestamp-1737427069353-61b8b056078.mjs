// vite.config.ts
import { resolve, dirname } from "path";
import { defineConfig } from "file:///home/ptolemy/webpages/npm/utils/react-utils/node_modules/vite/dist/node/index.js";
import react from "file:///home/ptolemy/webpages/npm/utils/react-utils/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///home/ptolemy/webpages/npm/utils/react-utils/node_modules/vite-plugin-dts/dist/index.mjs";
var __dirname = dirname(".");
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.lib.json")
    })
  ],
  publicDir: "public",
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.tsx"),
      formats: ["es"]
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["react", "react-dom", "clsx", "is-callable"],
      output: {
        entryFileNames: "[name].js"
      }
    }
  },
  resolve: {
    alias: {
      "src": resolve(__dirname, "src"),
      "lib": resolve(__dirname, "lib")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wdG9sZW15L3dlYnBhZ2VzL25wbS91dGlscy9yZWFjdC11dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcHRvbGVteS93ZWJwYWdlcy9ucG0vdXRpbHMvcmVhY3QtdXRpbHMvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcHRvbGVteS93ZWJwYWdlcy9ucG0vdXRpbHMvcmVhY3QtdXRpbHMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5cbmNvbnN0IF9fZGlybmFtZSA9IGRpcm5hbWUoXCIuXCIpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZHRzKHtcbiAgICAgIHRzY29uZmlnUGF0aDogcmVzb2x2ZShfX2Rpcm5hbWUsIFwidHNjb25maWcubGliLmpzb25cIilcbiAgICB9KVxuICBdLFxuICBwdWJsaWNEaXI6ICdwdWJsaWMnLFxuXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvbWFpbi50c3gnKSxcbiAgICAgIGZvcm1hdHM6IFsnZXMnXVxuICAgIH0sXG5cbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcblxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdjbHN4JywgJ2lzLWNhbGxhYmxlJ10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdbbmFtZV0uanMnXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJzcmNcIjogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICAgIFwibGliXCI6IHJlc29sdmUoX19kaXJuYW1lLCAnbGliJylcbiAgICB9XG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVCxTQUFTLFNBQVMsZUFBZTtBQUN2VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBRWhCLElBQU0sWUFBWSxRQUFRLEdBQUc7QUFHN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsY0FBYyxRQUFRLFdBQVcsbUJBQW1CO0FBQUEsSUFDdEQsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUVYLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sUUFBUSxXQUFXLGNBQWM7QUFBQSxNQUN4QyxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFFQSxlQUFlO0FBQUEsSUFFZixlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLFFBQVEsYUFBYTtBQUFBLE1BQ3RELFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE9BQU8sUUFBUSxXQUFXLEtBQUs7QUFBQSxNQUMvQixPQUFPLFFBQVEsV0FBVyxLQUFLO0FBQUEsSUFDakM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
