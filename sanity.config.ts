import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { schemaTypes } from "./sanity/schemas";
import { bibtexImporterPlugin } from "./sanity/plugins/bibtex-importer";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "compacctsys",
  title: "CompAcctSys",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            orderableDocumentListDeskItem({
              type: "researchTheme",
              title: "Research Themes",
              S,
              context,
            }),
            S.divider(),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !["researchTheme", "siteSettings"].includes(item.getId() ?? "")
            ),
          ]),
    }),
    visionTool(),
    bibtexImporterPlugin(),
  ],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
