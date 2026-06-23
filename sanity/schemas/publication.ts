import { defineField, defineType } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [
        defineField({
          name: "author",
          title: "Author",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "teamMember",
              title: "Team Member (if internal)",
              type: "reference",
              to: [{ type: "teamMember" }],
              weak: true,
            }),
          ],
          preview: { select: { title: "name" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "venue",
      title: "Venue (full name)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "venueShort",
      title: "Venue Abbreviation",
      type: "string",
      description: 'e.g. "CHI", "CSCW", "UIST"',
    }),
    defineField({
      name: "venueDisplay",
      title: "Venue Display Name",
      type: "string",
      description: "The venue name shown on the website (from venuedisplay BibTeX field). Takes priority over venue/venueShort.",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (r) => r.required().min(1990).max(2100),
    }),
    defineField({
      name: "date",
      title: "Publication Date",
      type: "date",
      description:
        "Optional. Used only to order publications within the same year (newest first). Leave blank to fall back to when the entry was created.",
    }),
    defineField({
      name: "type",
      title: "Publication Type",
      type: "string",
      options: {
        list: [
          { title: "Conference", value: "conference" },
          { title: "Journal", value: "journal" },
          { title: "Workshop", value: "workshop" },
          { title: "arXiv / Preprint", value: "arxiv" },
          { title: "Book Chapter", value: "book-chapter" },
          { title: "Demo", value: "demo" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "conference",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "bibtex",
      title: "BibTeX",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "award",
      title: "Award",
      type: "string",
      description: 'e.g. "Best Paper Award", "Honourable Mention"',
    }),
    defineField({
      name: "researchThemes",
      title: "Research Themes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "researchTheme" }] }],
    }),
  ],
  orderings: [
    {
      title: "Year (newest first)",
      name: "yearDesc",
      by: [
        { field: "year", direction: "desc" },
        { field: "date", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      venue: "venueShort",
      award: "award",
    },
    prepare({ title, year, venue, award }) {
      const subtitle = [venue, year, award].filter(Boolean).join(" · ");
      return { title, subtitle };
    },
  },
});
