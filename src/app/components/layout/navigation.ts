import { LayoutGrid, Plus, Users } from "lucide-react";
import type { UserRole } from "../../lib/userRole";

export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
  // { icon: CircleAlert, label: "Open Items", path: "/open-items" },
  { icon: Plus, label: "New Request", path: "/new-request" },
  { icon: Users, label: "Users", path: "/users" },
  // { icon: Link2, label: "Requester Mapping", path: "/requester-mapping" },
];

const REQUESTER_NAV_ITEMS: NavItem[] = [
  { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: Plus, label: "New Request", path: "/new-request" },
  // { icon: FileText, label: "My Requests", path: "/my-requests" },
];

export function getNavItemsByRole(role: UserRole | null): NavItem[] {
  if (role === "requester") {
    return REQUESTER_NAV_ITEMS;
  }

  return ADMIN_NAV_ITEMS;
}
