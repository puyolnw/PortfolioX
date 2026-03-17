import { Routes, Route } from 'react-router-dom';
import MoocHomeReal from './pages/MoocHomeReal';
import MoocCoursesReal from './pages/MoocCoursesReal';
import { FacultyProvider } from './hooks/useFaculty';

const MoocRouter = () => {
  return (
    <FacultyProvider>
      <Routes>
        <Route path="/" element={<MoocHomeReal />} />
        <Route path="/courses" element={<MoocCoursesReal />} />
      </Routes>
    </FacultyProvider>
  );
};

export default MoocRouter;
