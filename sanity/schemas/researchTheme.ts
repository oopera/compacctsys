import { defineField, defineType } from "sanity";

export const researchTheme = defineType({
  name: "researchTheme",
  title: "Research Theme",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title" },
  },
});
