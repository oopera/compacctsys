/**
 * Patches project.description and newsItem.body from plain strings → Portable Text arrays.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

function toPortableText(text: string) {
  return [
    {
      _type: "block",
      _key: "b0",
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: "s0", text, marks: [] }],
    },
  ];
}

async function main() {
  // Fix project descriptions
  const projects = await client.fetch(`*[_type == "project"]{_id, description}`);
  const stringProjects = projects.filter((p: any) => typeof p.description === "string");
  console.log(`Found ${stringProjects.length} projects with string descriptions`);
  for (const p of stringProjects) {
    await client.patch(p._id).set({ description: toPortableText(p.description) }).commit();
    console.log(`  ✓ patched project ${p._id}`);
  }

  // Fix news bodies
  const newsItems = await client.fetch(`*[_type == "newsItem"]{_id, body}`);
  const stringNews = newsItems.filter((n: any) => typeof n.body === "string");
  console.log(`Found ${stringNews.length} news items with string bodies`);
  for (const n of stringNews) {
    await client.patch(n._id).set({ body: toPortableText(n.body) }).commit();
    console.log(`  ✓ patched news ${n._id}`);
  }

  console.log("\n✅ Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
