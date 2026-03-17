import { Routes, Route, Navigate } from 'react-router-dom';
import SmpLoginPage from './SmpLoginPage';
import SmpLayout from './SmpLayout';
import SmpDashboard from './SmpDashboard';
import SmpPatients from './SmpPatients';
import SmpStaff from './SmpStaff';
import SmpDepartments from './SmpDepartments';
import SmpReports from './SmpReports';

const SmpRouter = () => (
  <Routes>
    <Route index element={<SmpLoginPage />} />
    <Route element={<SmpLayout />}>
      <Route path="dashboard" element={<SmpDashboard />} />
      <Route path="patients/add" element={<SmpPatients />} />
      <Route path="patients/search" element={<SmpPatients />} />
      <Route path="staff" element={<SmpStaff />} />
      <Route path="departments" element={<SmpDepartments />} />
      <Route path="rooms" element={<SmpDepartments />} />
      <Route path="reports/screening" element={<SmpReports />} />
      <Route path="reports/patient" element={<SmpReports />} />
      <Route path="reports/doctor" element={<SmpReports />} />
      <Route path="reports/nurse" element={<SmpReports />} />
    </Route>
    <Route path="*" element={<Navigate to="/demo/smp" replace />} />
  </Routes>
);

export default SmpRouter;
