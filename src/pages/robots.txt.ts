import type { APIRoute } from "astro";
import { SITE } from "../consts";

// Generated so the staging site (new.childrenofhopecdc.com) can wave crawlers off.
// Set PUBLIC_NOINDEX=true there; production leaves it unset and gets the normal file.
const noindex = import.meta.env.PUBLIC_NOINDEX === "true";

const body = noindex
  ? `User-agent: *\nDisallow: /\n`
  : `User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", SITE.url).href}\n`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
