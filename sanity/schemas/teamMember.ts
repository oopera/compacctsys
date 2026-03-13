import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Prof. Dr.", "Dr."',
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Principal Investigator", value: "pi" },
          { title: "PostDoc", value: "postdoc" },
          { title: "PhD Candidate", value: "phd" },
          { title: "Associate Researcher", value: "associate" },
          { title: "Administrative", value: "admin" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "website",
      title: "Personal Website",
      type: "url",
      description: "https://example.com",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
      description: "https://linkedin.com/in/…",
    }),
    defineField({
      name: "orcid",
      title: "ORCID",
      type: "url",
      description: "https://orcid.org/0000-0000-0000-0000",
    }),
    defineField({
      name: "scholar",
      title: "Google Scholar",
      type: "url",
      description: "https://scholar.google.com/citations?user=…",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 99,
    }),
    defineField({
      name: "current",
      title: "Current Member",
      type: "boolean",
      initialValue: true,
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
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
