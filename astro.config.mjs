import { defineConfig } from "astro/config";

// Sitio estático (SSG). ES en la raíz, EN bajo /en.
export default defineConfig({
  site: "https://walo-delta.vercel.app",
  trailingSlash: "ignore",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
