import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../consts";
import { getAnnouncements, isExternal } from "../utils";

export function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.url);
  const items = getAnnouncements().map((a) => ({
    title: a.title,
    description: a.summary,
    pubDate: new Date(`${a.date}T12:00:00Z`),
    link: isExternal(a.href) ? a.href : new URL(a.href, site).href,
  }));

  return rss({
    title: `${SITE.longName} — Announcements`,
    description: SITE.defaultDescription,
    site,
    items,
  });
}
