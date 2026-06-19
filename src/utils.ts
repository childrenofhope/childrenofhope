import announcementsData from "./data/announcements.json";

export interface Announcement {
  date: string;
  title: string;
  summary: string;
  href: string;
  featured?: boolean;
}

/** Format an ISO date (YYYY-MM-DD) as "April 27, 2026" without timezone drift. */
export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

/** Announcements sorted newest-first. */
export function getAnnouncements(): Announcement[] {
  return [...(announcementsData as Announcement[])].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** True for off-site links (open in a new tab). */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
