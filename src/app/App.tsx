import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { UploadRequest } from './pages/UploadRequest';
import { RequestForm } from './pages/RequestForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new-request" element={<UploadRequest />} />
        <Route path="/request-form" element={<RequestForm />} />
        <Route
          path="/open-items"
          element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-semibold">Open Items</h1>
              </div>
            </AppLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-semibold">Users</h1>
              </div>
            </AppLayout>
          }
        />
        <Route
          path="/requester-mapping"
          element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-semibold">Requester Mapping</h1>
              </div>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
