import { LayoutGrid, CircleAlert, Upload, Users, Link2, LogOut, Bell, CircleUserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import murphyLogo from '../../assets/Murphy.svg';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: CircleAlert, label: 'Open Items', path: '/open-items' },
    { icon: Upload, label: 'New Request', path: '/new-request' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Link2, label: 'Requester Mapping', path: '/requester-mapping' },
  ];

  const activePageLabel = navItems.find((item) => item.path === location.pathname)?.label ?? 'Dashboard';

  return (
    <div className="flex h-screen max-w-full overflow-x-hidden bg-[#F6F8FB]">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#F8F9FC] border-r border-[#E5E7EB] flex flex-col">
        <nav className="flex-1 px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 flex flex-col overflow-x-hidden">
        {/* Top Navigation */}
        <header className="h-16 border-b border-[#D1D5DB] bg-[#E5E7EB] px-6">
          <div className="flex h-full items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-5">
              <div className="min-w-[120px] leading-normal">
                <img src={murphyLogo} alt="Murphy logo" className="h-8 w-auto" />
              </div>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-lg leading-normal font-semibold text-[#374151]">Flow Agent</p>
                <p className="truncate text-base leading-normal text-[#374151]">{activePageLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-[#4B5563]">
              <button aria-label="Notifications" className="rounded-md p-1.5 hover:bg-gray-200">
                <Bell className="h-5 w-5" />
              </button>
              <button
                aria-label="Log out"
                className="rounded-md p-1.5 transition-colors hover:bg-gray-200 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
              <div className="relative">
                <CircleUserRound className="h-8 w-8" />
                <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-[#16A34A] ring-2 ring-[#E5E7EB]" />
              </div>
              <span className="text-sm font-semibold text-[#4B5563]">John Smith</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
