export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export const metadata = {
  title: "Research Themes — CompAcctSys",
};

export default function ProjectsPage() {
  redirect("/research-themes");
}
