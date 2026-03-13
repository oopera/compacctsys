import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Full Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Short Title / Acronym",
      type: "string",
      description: 'e.g. "RAInS"',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
        ],
      },
      initialValue: "active",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "funders",
      title: "Funders",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "collaborators",
      title: "External Collaborators",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
    }),
    defineField({
      name: "researchThemes",
      title: "Research Themes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "researchTheme" }] }],
    }),
    defineField({
      name: "url",
      title: "Project Website",
      type: "url",
    }),
    defineField({
      name: "startYear",
      title: "Start Year",
      type: "number",
    }),
    defineField({
      name: "endYear",
      title: "End Year",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "shortTitle",
      subtitle: "title",
    },
    prepare({ title, subtitle }) {
      return { title: title ?? subtitle, subtitle: title ? subtitle : undefined };
    },
  },
});
