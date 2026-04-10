# CompAcctSys Website

Website for the Compliant and Accountable Systems Research Group.

## Stack

- **Framework**: Next.js 16 (App Router)
- **CMS**: Sanity v5
- **Styling**: Tailwind CSS v4
- **3D**: Three.js (canvas animations)
- **Language**: TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Create .env.local with Sanity credentials
cp .env.example .env.local

# Run development server
npm run dev
```

The site runs at `http://localhost:3000`. The Sanity Studio is at `/studio`.

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (e.g. `production`) |
| `SANITY_API_TOKEN` | Sanity API token (read/write) |

## Project Structure

```
src/
  app/                    # Next.js pages
    page.tsx              # Homepage
    team/                 # Team page
    research-themes/      # Research themes page
    publications/         # Publications page
    studio/               # Sanity Studio
  components/
    Nav.tsx / NavShell.tsx # Navigation (server + client)
    NavLogo.tsx           # Animated logo (client)
    Footer.tsx            # Footer (server, fetches from Sanity)
    ThemeToggle.tsx        # Dark/light mode toggle
    SceneCanvas.tsx        # Three.js canvas animations
    sections/             # Page section components
  lib/
    data/                 # Fallback data (used when Sanity is empty)
    sanity/               # Sanity client and GROQ queries
  types/                  # TypeScript interfaces

sanity/
  schemas/                # Sanity document schemas
  plugins/
    bibtex-importer/      # BibTeX import tool for publications

public/
  team/                   # Team member photos
  procurement/            # Built procurement sub-app (if present)
```

## Content Management

All content is managed through Sanity Studio at `/studio`:

- **Team Members** - split into Current / Past views. Sorted alphabetically on the site (PI first).
- **Research Themes** - drag-to-reorder list.
- **Publications** - import via the BibTeX Import tool. Supports `venuedisplay` custom field for display names.
- **News** - news items shown on the homepage.
- **Site Settings** - group name, tagline, contact email, affiliations.

### BibTeX Importer

In the Studio, use the **BibTeX Import** tool to bulk-import publications:

1. Paste BibTeX entries
2. Preview parsed results (team members are auto-linked)
3. Select and import

The importer also has a **Delete all publications** button for clearing before a fresh import.

Key BibTeX field mappings:
- `venuedisplay` -> display venue name on the website
- `booktitle` / `journal` -> full venue name (fallback)
- `url` -> publisher link

## Build

```bash
npm run build
```

This will:
1. Build the Procurement sub-app if the `Procurement/` directory is present (skipped otherwise)
2. Build the Next.js site

## Procurement Sub-App

A separate Vite/React app served at `/procurement`. To set up:

1. Clone the procurement repo into `Procurement/`
2. Run `npm run build:procurement` to build and copy to `public/procurement/`

The sub-app is built automatically during `npm run build` if the directory exists.

## Deployment

Deployed via Vercel. Pushes to `main` trigger automatic deployments.
