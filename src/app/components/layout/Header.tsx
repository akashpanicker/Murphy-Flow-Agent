import { Bell, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import avatar from "../../../assets/Avatar.svg";
import {
  getStoredUserRole,
  getUserRoleLabel,
  USER_ROLE_STORAGE_KEY,
} from "../../lib/userRole";
import { getNavItemsByRole } from "./navigation";

const PATH_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/new-request": "New Procurement Request",
  "/request-form": "New Procurement Request",
  "/my-requests": "My Requests",
  "/open-items": "Open Items",
  "/users": "Users",
  "/requester-mapping": "Requester Mapping",
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getStoredUserRole();
  const navItems = getNavItemsByRole(role);
  const locationState = (location.state || {}) as { fromPath?: string };
  const currentLabel =
    PATH_LABELS[location.pathname] ??
    navItems.find((item) => item.path === location.pathname)?.label ??
    "Dashboard";

  const isNewProcurementFlow =
    location.pathname === "/new-request" || location.pathname === "/request-form";

  const parentPath = isNewProcurementFlow
    ? locationState.fromPath && locationState.fromPath !== location.pathname
      ? locationState.fromPath
      : "/dashboard"
    : undefined;
  const parentLabel = parentPath ? PATH_LABELS[parentPath] ?? "Dashboard" : undefined;

  const handleLogout = () => {
    window.localStorage.removeItem(USER_ROLE_STORAGE_KEY);
    navigate("/", { replace: true });
  };

  return (
    <header className="h-16 border-b border-[#E5E7EB] bg-white px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-[108px] leading-none">
            <p className="text-[13px] font-black tracking-[0.1em] text-[#003A77]">MURPHY</p>
            <p className="text-[7px] font-semibold tracking-[0.24em] text-[#1F2937]">
              OIL CORPORATION
            </p>
          </div>
          <div className="flex min-w-0 flex-col leading-[1.2]">
            <p className="whitespace-nowrap text-[16px] font-semibold text-[#111827]">Flow Agent</p>
            {parentPath && parentLabel ? (
              <div className="mt-1 flex min-w-0 items-center gap-2 text-[12px]">
                <Link
                  to={parentPath}
                  className="truncate text-[#2563EB] underline underline-offset-2 hover:text-[#1D4ED8]"
                >
                  {parentLabel}
                </Link>
                <span className="text-[#6B7280]">/</span>
                <span className="truncate text-[#374151]">{currentLabel}</span>
              </div>
            ) : (
              <p className="mt-1 truncate text-[12px] text-[#6B7280]">{currentLabel}</p>
            )}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-[#4B5563]">
          <button
            aria-label="Notifications"
            className="rounded-md p-1.5 transition-colors hover:bg-[#F3F4F6]"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            aria-label="Log out"
            onClick={handleLogout}
            className="rounded-md p-1.5 transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <div>
            <img src={avatar} alt="User avatar" className="h-8 w-8" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-semibold text-[#4B5563]">John Smith</span>
            <span className="text-[12px] text-[#6B7280]">{getUserRoleLabel(role)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
