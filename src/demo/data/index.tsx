import { Routes, Route } from 'react-router-dom';
import DataLayout from './DataLayout';
import DataDashboard from './DataDashboard';
import DataProfile from './DataProfile';
import DataStudents from './DataStudents';
import DataEmployers from './DataEmployers';
import DataJobPosts from './DataJobPosts';
import DataApplications from './DataApplications';
import DataEvaluations from './DataEvaluations';
import DataLoginPage from './DataLoginPage';
import ForbiddenPage from '../shared/ForbiddenPage';

export default function DataRouter() {
  return (
    <Routes>
      <Route index element={<DataLoginPage />} />
      <Route path="dashboard" element={<DataLayout><DataDashboard /></DataLayout>} />
      <Route path="profile" element={<DataLayout><DataProfile /></DataLayout>} />
      <Route path="students" element={<DataLayout><DataStudents /></DataLayout>} />
      <Route path="employers" element={<DataLayout><DataEmployers /></DataLayout>} />
      <Route path="job-posts" element={<DataLayout><DataJobPosts /></DataLayout>} />
      <Route path="applications" element={<DataLayout><DataApplications /></DataLayout>} />
      <Route path="evaluations" element={<DataLayout><DataEvaluations /></DataLayout>} />
      <Route path="*" element={<ForbiddenPage />} />
    </Routes>
  );
}
