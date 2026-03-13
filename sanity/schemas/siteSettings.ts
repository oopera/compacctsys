import { defineField, defineType } from "sanity";

// Singleton document — only one instance should exist.
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "groupName",
      title: "Group Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Group Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "domain",
      title: "Domain",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "groupName" },
  },
});
