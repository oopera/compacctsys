import { getSiteSettings } from "@/lib/sanity/queries";
import { NavShell } from "./NavShell";

export async function Nav() {
  const [settings] = await Promise.all([
    getSiteSettings(),
  ]);
  return <NavShell groupName={settings?.groupName ?? "CompAcctSys"} />;
}
