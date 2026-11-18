import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth';
import { LandingPage } from './features/landing/LandingPage';
import { StyleLab } from './features/style-lab/StyleLab';
import { WorkspaceLayout } from './features/workspace/WorkspaceLayout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/style-lab" element={<StyleLab />} />
          <Route path="/preview/*" element={<WorkspaceLayout isPreview={true} />} />
          <Route path="/workspace/*" element={<WorkspaceLayout isPreview={false} />} />
          <Route path="/dashboard" element={<Navigate to="/workspace" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
