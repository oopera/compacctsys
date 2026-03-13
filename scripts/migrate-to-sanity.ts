/**
 * Migration script: imports all fixture data + team photos into Sanity.
 *
 * Prerequisites:
 *   1. Fill in .env.local with real NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN
 *      (token needs write permissions — create one at sanity.io/manage)
 *   2. npx tsx scripts/migrate-to-sanity.ts
 */

import { createClient } from "@sanity/client";
import { createReadStream, statSync } from "fs";
import { resolve } from "path";
import "dotenv/config";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

const PUBLIC_DIR = resolve(process.cwd(), "public");

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function uploadImage(filePath: string): Promise<string> {
  const abs = resolve(PUBLIC_DIR, filePath.replace(/^\//, ""));
  const stat = statSync(abs);
  const ext = abs.split(".").pop()!;
  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  const asset = await client.assets.upload("image", createReadStream(abs), {
    filename: abs.split("/").pop(),
    contentType: mimeMap[ext] ?? "image/jpeg",
  });
  console.log(`  ✓ Uploaded ${filePath} → ${asset._id}`);
  return asset._id;
}

// ─── Team ─────────────────────────────────────────────────────────────────────

async function migrateTeam() {
  console.log("\n── Team members ──");
  const { team } = await import("../src/lib/data/team.js");

  for (const m of team) {
    let photoRef: object | undefined;
    if (m.photo) {
      const assetId = await uploadImage(m.photo);
      photoRef = { _type: "image", asset: { _type: "reference", _ref: assetId } };
    }

    await client.createOrReplace({
      _type: "teamMember",
      _id: `teamMember-${m.id}`,
      name: m.name,
      title: m.title,
      role: m.role,
      bio: m.bio
        ? [{ _type: "block", _key: "bio0", children: [{ _type: "span", text: m.bio, marks: [] }], markDefs: [], style: "normal" }]
        : undefined,
      email: m.email,
      photo: photoRef,
      links: m.links?.map((l, i) => ({ ...l, _key: `link${i}` })) ?? [],
      order: m.order,
      current: m.current,
    });
    console.log(`  ✓ ${m.name}`);
  }
}

// ─── Research themes ──────────────────────────────────────────────────────────

async function migrateResearchThemes() {
  console.log("\n── Research themes ──");
  const { researchThemes } = await import("../src/lib/data/researchThemes.js");

  for (const t of researchThemes) {
    await client.createOrReplace({
      _type: "researchTheme",
      _id: `researchTheme-${t.id}`,
      title: t.title,
      description: t.description,
      order: t.order,
    });
    console.log(`  ✓ ${t.title}`);
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

async function migrateProjects() {
  console.log("\n── Projects ──");
  const { projects } = await import("../src/lib/data/projects.js");

  for (const p of projects) {
    await client.createOrReplace({
      _type: "project",
      _id: `project-${p.id}`,
      title: p.title,
      shortTitle: p.shortTitle,
      description: p.description,
      status: p.status,
      funders: p.funders,
      collaborators: p.collaborators,
      teamMembers: p.teamMemberIds?.map((id) => ({
        _type: "reference",
        _ref: `teamMember-${id}`,
        _key: id,
      })),
      researchThemes: p.researchThemeIds?.map((id) => ({
        _type: "reference",
        _ref: `researchTheme-${id}`,
        _key: id,
      })),
      url: p.url,
      startYear: p.startYear,
      endYear: p.endYear,
    });
    console.log(`  ✓ ${p.title}`);
  }
}

// ─── Publications ─────────────────────────────────────────────────────────────

async function migratePublications() {
  console.log("\n── Publications ──");
  const { publications } = await import("../src/lib/data/publications.js");

  for (const p of publications) {
    await client.createOrReplace({
      _type: "publication",
      _id: `publication-${p.id}`,
      title: p.title,
      authors: p.authors.map((a, i) => ({
        _key: `author${i}`,
        name: a.name,
        teamMember: a.teamMemberId
          ? { _type: "reference", _ref: `teamMember-${a.teamMemberId}`, _weak: true }
          : undefined,
      })),
      venue: p.venue,
      venueShort: p.venueShort,
      year: p.year,
      type: p.type,
      abstract: p.abstract,
      doi: p.doi,
      url: p.url,
      bibtex: p.bibtex,
      award: p.award,
      researchThemes: p.researchThemeIds?.map((id) => ({
        _type: "reference",
        _ref: `researchTheme-${id}`,
        _key: id,
      })),
    });
    console.log(`  ✓ ${p.title}`);
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────

async function migrateNews() {
  console.log("\n── News ──");
  const { news } = await import("../src/lib/data/news.js");

  for (const n of news) {
    await client.createOrReplace({
      _type: "newsItem",
      _id: `newsItem-${n.id}`,
      title: n.title,
      slug: { _type: "slug", current: n.slug },
      date: n.date,
      body: n.body,
      tags: n.tags,
      externalUrl: n.externalUrl,
      publication: n.publicationId
        ? { _type: "reference", _ref: `publication-${n.publicationId}` }
        : undefined,
    });
    console.log(`  ✓ ${n.title}`);
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Migrating to Sanity project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  await migrateResearchThemes();
  await migrateTeam();         // team before projects (projects reference team)
  await migrateProjects();
  await migratePublications();
  await migrateNews();
  console.log("\n✅ Migration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
