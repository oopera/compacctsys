import { getSiteSettings, getApplyPageVisibility } from "@/lib/sanity/queries";
import { NavShell } from "./NavShell";

export async function Nav() {
  const [settings, showApply] = await Promise.all([
    getSiteSettings(),
    getApplyPageVisibility(),
  ]);
  return <NavShell groupName={settings?.groupName ?? "CompAcctSys"} showApply={showApply} />;
}
