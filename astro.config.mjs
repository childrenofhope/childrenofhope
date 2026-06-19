// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://childrenofhopecdc.com",
  output: "static",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  build: {
    // Keep clean URLs (e.g. /contact) as .html files Cloudflare Pages serves directly.
    format: "file",
  },
});
