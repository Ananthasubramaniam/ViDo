import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './features/landing/LandingPage';
import { StyleLab } from './features/style-lab/StyleLab';
import { WorkspaceLayout } from './features/workspace/WorkspaceLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/style-lab" element={<StyleLab />} />
        <Route path="/preview/*" element={<WorkspaceLayout />} />
        <Route path="/workspace/*" element={<Navigate to="/preview" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
