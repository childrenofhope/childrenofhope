import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../consts";
import { getAnnouncements, isExternal } from "../utils";

export function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.url);
  // A few archived announcements have no link of their own; point those at the
  // announcements page so every item still resolves somewhere.
  const items = getAnnouncements().map((a) => ({
    title: a.title,
    description: a.summary,
    pubDate: new Date(`${a.date}T12:00:00Z`),
    link: isExternal(a.href)
      ? (a.href as string)
      : new URL(a.href ?? "/announcements", site).href,
  }));

  return rss({
    title: `${SITE.longName} — Announcements`,
    description: SITE.defaultDescription,
    site,
    items,
  });
}
