import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useLocation } from "react-router";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const hideSidebar = location.pathname === "/request-form";

  return (
    <div className="flex h-screen max-w-full flex-col overflow-hidden bg-[#F6F8FB]">
      <Header />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!hideSidebar && <Sidebar />}
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#F6F8FB] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
