import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const researchTheme = defineType({
  name: "researchTheme",
  title: "Research Theme",
  type: "document",
  fields: [
    orderRankField({ type: "researchTheme" }),
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
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: { title: "title" },
  },
});
