import { defineField, defineType } from "sanity";

// Singleton document — only one instance should exist.
export const applyPage = defineType({
  name: "applyPage",
  title: "Apply Page",
  type: "document",
  fields: [
    defineField({
      name: "showApplyPage",
      title: "Show Apply Page",
      description: "When off, the Apply button is hidden from the nav and the page returns 404.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "intro",
      title: "Intro Text",
      description: "Optional paragraph shown below the hero.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "positions",
      title: "Open Positions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "role",        title: "Role",        type: "string", validation: (r) => r.required() }),
            defineField({ name: "type",        title: "Type / Duration", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
          ],
          preview: {
            select: { title: "role", subtitle: "type" },
          },
        },
      ],
    }),
    defineField({
      name: "expectations",
      title: "What We Look For",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body",    title: "Body",    type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "heading" },
          },
        },
      ],
    }),
    defineField({
      name: "howToApply",
      title: "How to Apply",
      description: "Introductory paragraph for the How to Apply section.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "applicationChecklist",
      title: "Application Checklist",
      description: "Bullet points listing what to include in an application.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "applicationEmail",
      title: "Application Email",
      description: "Override the default contact email for applications.",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare: () => ({ title: "Apply Page" }),
  },
});
