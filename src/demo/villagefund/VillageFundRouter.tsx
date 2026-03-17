import { Routes, Route } from 'react-router-dom';
import VFLoginReal from './pages/authentication/login/index';
import FinalVfDashboard from './pages/VfDashboardReal';

const VillageFundRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<VFLoginReal />} />
      <Route path="/dashboard" element={<FinalVfDashboard />} />
    </Routes>
  );
};

export default VillageFundRouter;
