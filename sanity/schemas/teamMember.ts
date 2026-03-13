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
      name: "links",
      title: "Links",
      type: "array",
      of: [
        defineField({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            defineField({
              name: "provider",
              title: "Provider",
              type: "string",
              options: {
                list: [
                  { title: "Personal Website", value: "website" },
                  { title: "LinkedIn",          value: "linkedin" },
                  { title: "ORCID",             value: "orcid" },
                  { title: "Google Scholar",    value: "scholar" },
                ],
                layout: "radio",
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "provider", subtitle: "url" },
          },
        }),
      ],
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
