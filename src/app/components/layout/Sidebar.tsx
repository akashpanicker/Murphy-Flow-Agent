import { Link, useLocation } from "react-router";
import { navItems } from "./navigation";

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[240px] flex-shrink-0 border-r border-[#E5E7EB] bg-white">
      <nav className="flex h-full flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              state={{ fromPath: location.pathname }}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#E0E7FF] font-medium text-[#2563EB]"
                  : "text-[#374151] hover:bg-[#EEF2FF]"
              }`}
            >
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
