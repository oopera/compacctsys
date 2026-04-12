// ─── Team ────────────────────────────────────────────────────────────────────

export type TeamRole =
  | "pi"
  | "postdoc"
  | "phd"
  | "research-assistant"
  | "research-intern"
  | "associate"
  | "admin";

export type TeamMemberLinkProvider = "website" | "linkedin" | "orcid" | "scholar";

export interface TeamMemberLink {
  provider: TeamMemberLinkProvider;
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  title?: string; // e.g. "Dr.", "Prof. Dr."
  bio?: string;
  email?: string;
  photo?: string;
  links?: TeamMemberLink[];
  current: boolean;
}

// ─── Research Themes ─────────────────────────────────────────────────────────

export interface ResearchTheme {
  id: string;
  title: string;
  description: string;
  order: number;
}

// ─── Publications ────────────────────────────────────────────────────────────

export type PublicationType =
  | "conference"
  | "journal"
  | "workshop"
  | "arxiv"
  | "book-chapter"
  | "demo"
  | "other";

export interface PublicationAuthor {
  name: string;
  teamMemberId?: string; // if internal
}

export interface Publication {
  id: string;
  title: string;
  authors: PublicationAuthor[];
  venue: string;           // full venue name
  venueShort?: string;     // e.g. "CHI", "CSCW"
  venueDisplay?: string;   // display name from venuedisplay bibtex field
  year: number;
  type: PublicationType;
  abstract?: string;
  doi?: string;
  url?: string;
  bibtex?: string;
  award?: string;          // e.g. "Best Paper Award"
  researchThemeIds: string[];
  teamMemberIds: string[];
}

// ─── News ────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  date: string; // ISO date string
  body: any; // Portable Text block content
  tags: string[];
  externalUrl?: string;
  image?: string;
  publicationId?: string; // link to related publication if relevant
}

// ─── Site Settings ───────────────────────────────────────────────────────────

export interface SiteSettings {
  groupName: string;
  tagline?: string;
  description?: any; // Portable Text block content
  contactEmail?: string;
  affiliations?: string[];
  domain?: string;
}
