import { PortableText } from "next-sanity";

const ptComponents = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-[var(--main)] hover:underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export function PortableTextRenderer({ value }: { value: any }) {
  return <PortableText value={value} components={ptComponents} />;
}
