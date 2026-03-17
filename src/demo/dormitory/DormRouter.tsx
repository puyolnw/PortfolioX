import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import DormApp from './App.jsx';
import './mock-api.jsx';
import './index.css';

const DormRouter = () => {
  useEffect(() => {
    // Add specific scroll behavior or any initialization needed for this demo
    document.title = "ระบบจัดการหอพัก | Portfolio Demo";
    
    // Watermark handling
    const addWatermark = () => {
      if (!document.getElementById('demo-watermark')) {
        const watermark = document.createElement('div');
        watermark.id = 'demo-watermark';
        watermark.innerHTML = 'PREVIEW';
        watermark.style.position = 'fixed';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        watermark.style.fontSize = '15vw';
        watermark.style.fontWeight = '900';
        watermark.style.color = 'rgba(0, 0, 0, 0.05)';
        watermark.style.pointerEvents = 'none';
        watermark.style.zIndex = '9999';
        watermark.style.whiteSpace = 'nowrap';
        document.body.appendChild(watermark);
      }
    };
    addWatermark();

    return () => {
      const watermark = document.getElementById('demo-watermark');
      if (watermark) watermark.remove();
    };
  }, []);

  return (
    <div className="dormitory-demo-container">
      <Routes>
        <Route path="/*" element={<DormApp />} />
      </Routes>
    </div>
  );
};

export default DormRouter;
