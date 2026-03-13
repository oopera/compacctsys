import { client } from "./client";
import type {
  TeamMember,
  ResearchTheme,
  Project,
  Publication,
  NewsItem,
  SiteSettings,
} from "@/types";

// ─── Team ────────────────────────────────────────────────────────────────────

const teamQuery = `*[_type == "teamMember" && current == true] | order(order asc) {
  "id": _id,
  name,
  title,
  role,
  bio,
  email,
  "photo": photo.asset->url,
  "photoHotspot": photo.hotspot,
  links[]{label, url},
  order,
  current
}`;

export async function getTeam(): Promise<TeamMember[]> {
  return client.fetch(teamQuery, {}, { next: { tags: ["teamMember"] } });
}

// ─── Research themes ─────────────────────────────────────────────────────────

const researchThemesQuery = `*[_type == "researchTheme"] | order(orderRank asc) {
  "id": _id,
  title,
  description,
  orderRank
}`;

export async function getResearchThemes(): Promise<ResearchTheme[]> {
  return client.fetch(researchThemesQuery, {}, { next: { tags: ["researchTheme"] } });
}

// ─── Projects ────────────────────────────────────────────────────────────────

const projectsQuery = `*[_type == "project"] | order(_createdAt asc) {
  "id": _id,
  title,
  shortTitle,
  "description": pt::text(description),
  status,
  funders,
  collaborators,
  "teamMemberIds": teamMembers[]->_id,
  "researchThemeIds": researchThemes[]->_id,
  url,
  startYear,
  endYear
}`;

export async function getProjects(): Promise<Project[]> {
  return client.fetch(projectsQuery, {}, { next: { tags: ["project"] } });
}

// ─── Publications ────────────────────────────────────────────────────────────

const publicationsQuery = `*[_type == "publication"] | order(year desc) {
  "id": _id,
  title,
  authors[]{
    name,
    "teamMemberId": teamMember->_id
  },
  venue,
  venueShort,
  year,
  type,
  abstract,
  doi,
  url,
  bibtex,
  award,
  "researchThemeIds": researchThemes[]->_id,
  "teamMemberIds": authors[defined(teamMember)].teamMember->_id
}`;

export async function getPublications(): Promise<Publication[]> {
  return client.fetch(publicationsQuery, {}, { next: { tags: ["publication"] } });
}

// ─── News ────────────────────────────────────────────────────────────────────

const newsQuery = `*[_type == "newsItem"] | order(date desc) {
  "id": _id,
  title,
  "slug": slug.current,
  date,
  "body": pt::text(body),
  tags,
  externalUrl,
  "image": image.asset->url,
  "publicationId": publication->_id
}`;

export async function getNews(): Promise<NewsItem[]> {
  return client.fetch(newsQuery, {}, { next: { tags: ["newsItem"] } });
}

// ─── Awards ──────────────────────────────────────────────────────────────────

const awardsQuery = `*[_type == "publication" && defined(award)] | order(year desc) {
  "id": _id,
  title,
  authors[]{
    name,
    "teamMemberId": teamMember->_id
  },
  venue,
  venueShort,
  year,
  award,
  doi,
  url
}`;

export async function getAwardedPublications(): Promise<Publication[]> {
  return client.fetch(awardsQuery, {}, { next: { tags: ["publication"] } });
}

// ─── Site settings ───────────────────────────────────────────────────────────

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  "id": _id,
  siteTitle,
  tagline,
  email,
  affiliations
}`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(siteSettingsQuery, {}, { next: { tags: ["siteSettings"] } });
}
