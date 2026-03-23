import { teamMember } from "./teamMember";
import { researchTheme } from "./researchTheme";
import { project } from "./project";
import { publication } from "./publication";
import { newsItem } from "./newsItem";
import { siteSettings } from "./siteSettings";
import { applyPage } from "./applyPage";

export const schemaTypes = [
  siteSettings,
  applyPage,
  teamMember,
  researchTheme,
  project,
  publication,
  newsItem,
];
