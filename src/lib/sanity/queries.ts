import { client } from "./client";
import type {
  TeamMember,
  ResearchTheme,
  Publication,
  NewsItem,
  SiteSettings,
  ApplyPage,
} from "@/types";

// ─── Team ────────────────────────────────────────────────────────────────────

const teamQuery = `*[_type == "teamMember" && current == true] | order(order asc) {
  "id": _id,
  name,
  title,
  role,
  "bio": pt::text(bio),
  email,
  "photo": photo.asset->url,
  "photoHotspot": photo.hotspot,
  links[]{provider, url},
  order,
  current
}`;

export async function getTeam(): Promise<TeamMember[]> {
  return client.fetch(teamQuery, {}, { next: { tags: ["teamMember"] } });
}

const pastTeamQuery = `*[_type == "teamMember" && current == false] | order(order asc) {
  "id": _id,
  name,
  title,
  role,
  links[]{provider, url},
  order,
  current
}`;

export async function getPastTeam(): Promise<TeamMember[]> {
  return client.fetch(pastTeamQuery, {}, { next: { tags: ["teamMember"] } });
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

// ─── Apply page ──────────────────────────────────────────────────────────────

const applyPageQuery = `*[_type == "applyPage"][0] {
  showApplyPage,
  intro,
  positions[]{ role, type, description },
  expectations[]{ heading, body },
  howToApply,
  applicationChecklist,
  applicationEmail
}`;

export async function getApplyPage(): Promise<ApplyPage | null> {
  return client.fetch(applyPageQuery, {}, { next: { tags: ["applyPage"] } });
}

export async function getApplyPageVisibility(): Promise<boolean> {
  const result = await client.fetch<{ showApplyPage?: boolean } | null>(
    `*[_type == "applyPage"][0]{ showApplyPage }`,
    {},
    { next: { tags: ["applyPage"] } },
  );
  // Default to true if the field hasn't been set yet
  return result?.showApplyPage ?? true;
}

// ─── Site settings ───────────────────────────────────────────────────────────

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  groupName,
  tagline,
  "description": pt::text(description),
  contactEmail,
  affiliations,
  domain
}`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(siteSettingsQuery, {}, { next: { tags: ["siteSettings"] } });
}
