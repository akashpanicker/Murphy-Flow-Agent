import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { getStoredUserRole } from "./lib/userRole";
import { Dashboard } from "./pages/Dashboard";
import { RequestForm } from "./pages/RequestForm";
import { RoleSelection } from "./pages/RoleSelection";
import { UploadRequest } from "./pages/UploadRequest";

interface GuardProps {
  children: React.ReactNode;
}

function RequireRole({ children }: GuardProps) {
  const role = getStoredUserRole();

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function RequireAdmin({ children }: GuardProps) {
  const role = getStoredUserRole();

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route
          path="/dashboard"
          element={
            <RequireRole>
              <Dashboard />
            </RequireRole>
          }
        />
        <Route
          path="/new-request"
          element={
            <RequireRole>
              <UploadRequest />
            </RequireRole>
          }
        />
        <Route
          path="/request-form"
          element={
            <RequireRole>
              <RequestForm />
            </RequireRole>
          }
        />
        <Route
          path="/my-requests"
          element={
            <RequireRole>
              <AppLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-semibold">My Requests</h1>
                </div>
              </AppLayout>
            </RequireRole>
          }
        />
        <Route
          path="/open-items"
          element={
            <RequireRole>
              <RequireAdmin>
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-semibold">Open Items</h1>
                  </div>
                </AppLayout>
              </RequireAdmin>
            </RequireRole>
          }
        />
        <Route
          path="/users"
          element={
            <RequireRole>
              <RequireAdmin>
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-semibold">Users</h1>
                  </div>
                </AppLayout>
              </RequireAdmin>
            </RequireRole>
          }
        />
        <Route
          path="/requester-mapping"
          element={
            <RequireRole>
              <RequireAdmin>
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-semibold">Requester Mapping</h1>
                  </div>
                </AppLayout>
              </RequireAdmin>
            </RequireRole>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
