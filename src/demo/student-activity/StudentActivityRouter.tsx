import { Routes, Route } from 'react-router-dom';
// @ts-ignore
import App from './App.jsx';
import './mock-api.js';

export default function StudentActivityRouter() {
  return (
    <div className="student-activity-demo-wrapper">
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </div>
  );
}
