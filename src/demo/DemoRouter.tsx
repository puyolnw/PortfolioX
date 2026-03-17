import { Routes, Route } from 'react-router-dom';
import ForbiddenPage from './shared/ForbiddenPage';
import DataRouter from './data';
import SmpRouter from './smp/SmpRouter';
import DormRouter from './dormitory/DormRouter';
import StudentActivityRouter from './student-activity/StudentActivityRouter';

export default function DemoRouter() {
  return (
    <Routes>
      <Route path="data/*" element={<DataRouter />} />
      <Route path="smp/*" element={<SmpRouter />} />
      <Route path="dormitory/*" element={<DormRouter />} />
      <Route path="student-activity/*" element={<StudentActivityRouter />} />
      <Route path="*" element={<ForbiddenPage />} />
    </Routes>
  );
}
