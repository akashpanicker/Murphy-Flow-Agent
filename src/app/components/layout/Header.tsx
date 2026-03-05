import { Bell, LogOut } from "lucide-react";
import { useLocation } from "react-router";
import { navItems } from "./navigation";
import avatar from "../../../assets/Avatar.svg";

export function Header() {
  const location = useLocation();
  const activePageLabel =
    navItems.find((item) => item.path === location.pathname)?.label ??
    "Dashboard";

  return (
    <header className="h-16 border-b border-[#E5E7EB] bg-white px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-[108px] leading-none">
            <p className="text-[13px] font-black tracking-[0.1em] text-[#003A77]">
              MURPHY
            </p>
            <p className="text-[7px] font-semibold tracking-[0.24em] text-[#1F2937]">
              OIL CORPORATION
            </p>
          </div>
          <div className="flex min-w-0 flex-col leading-[1.2]">
            <p className="whitespace-nowrap text-[16px] font-semibold text-[#111827]">
              Flow Agent
            </p>
            <p className="truncate text-[12px] text-[#6B7280]">
              {activePageLabel}
            </p>
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
            className="rounded-md p-1.5 transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <div>
            <img src={avatar} alt="User avatar" className="h-8 w-8" />
          </div>
          <span className="text-[14px] font-semibold text-[#4B5563]">
            John Smith
          </span>
        </div>
      </div>
    </header>
  );
}
