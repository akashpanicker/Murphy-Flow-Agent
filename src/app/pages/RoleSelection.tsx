import { useNavigate } from "react-router";
import { setStoredUserRole, type UserRole } from "../lib/userRole";

export function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setStoredUserRole(role);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4">
      <div className="w-full max-w-xl rounded-xl border border-[#E5E7EB] bg-white p-10 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.1em] text-[#003A77]">MURPHY</p>
          <p className="text-xs font-semibold tracking-[0.24em] text-[#1F2937]">FLOWAGENT</p>
        </div>
        <h1 className="mt-8 text-center text-3xl font-semibold text-[#111827]">
          Select User Role
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleRoleSelect("admin")}
            className="rounded-lg border border-[#D1D5DB] bg-white px-6 py-5 text-xl font-semibold text-[#111827] transition-colors hover:border-[#2563EB] hover:bg-[#EFF6FF]"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect("requester")}
            className="rounded-lg border border-[#D1D5DB] bg-white px-6 py-5 text-xl font-semibold text-[#111827] transition-colors hover:border-[#2563EB] hover:bg-[#EFF6FF]"
          >
            Requester
          </button>
        </div>
      </div>
    </div>
  );
}
