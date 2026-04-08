import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CompAcctSys — Compliant and Accountable Systems Research Group",
  description:
    "Research at the intersection of technology, law & society. Multi-disciplinary work on compliance, accountability, and governance of emerging technologies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Default to system theme settings:
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}}catch(e){var t='light';}document.documentElement.dataset.theme=t;})();` }} />
        */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||'light';}catch(e){var t='light';}document.documentElement.dataset.theme=t;})();` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}>
        {children}
      </body>
    </html>
  );
}
