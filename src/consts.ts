/** Site-wide constants for Children of Hope. */

export const SITE = {
  name: "Children of Hope",
  subtitle: "Child Development Center",
  longName: "Children of Hope Child Development Center",
  tagline: "A positive first preschool experience within a Christian environment of understanding, acceptance and love.",
  url: "https://childrenofhopecdc.com",
  ogImage: "/assets/images/cohcdc-logo-alt.png",
  defaultDescription:
    "Children of Hope Child Development Center is a 5-Star rated preschool in Ahwatukee (Phoenix, AZ) offering a positive first school experience within a Christian environment of understanding, acceptance and love.",
} as const;

export const CONTACT = {
  phone: "(480) 759-1515",
  phoneHref: "tel:4807591515",
  email: "childrenofhope@myesperanza.org",
  addressLine1: "2601 E. Thunderhill Place",
  addressLine2: "Phoenix, AZ 85048",
  mapsUrl: "https://www.google.com/maps/place/2601+E+Thunderhill+Pl,+Phoenix,+AZ+85048/",
  facebook:
    "https://www.facebook.com/pages/Children-of-Hope-PreschoolChild-Development-Center-of-Ahwatukee/156923364318375",
} as const;

/** Primary navigation. */
export const NAV = [
  { label: "About", href: "/about/philosophy" },
  { label: "Program", href: "/about/program" },
  { label: "Teachers", href: "/about/teachers-and-staff" },
  { label: "Calendar", href: "/calendar" },
  { label: "Forms", href: "/forms" },
  { label: "Contact", href: "/contact" },
] as const;

/** Footer "Explore" links. */
export const FOOTER_LINKS = [
  { label: "About", href: "/about/philosophy" },
  { label: "Teachers & Staff", href: "/about/teachers-and-staff" },
  { label: "Calendar", href: "/calendar" },
  { label: "Announcements", href: "/announcements" },
  { label: "Forms", href: "/forms" },
] as const;
