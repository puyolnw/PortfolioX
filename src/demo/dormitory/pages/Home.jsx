import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          ยินดีต้อนรับสู่
          <span className="text-primary-600"> ระบบจองหอพักนักศึกษา</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          ค้นหาและจองหอพักที่เหมาะสมสำหรับคุณ ด้วยระบบที่ง่ายต่อการใช้งาน 
          และมีตัวเลือกมากมายให้เลือกสรร
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/demo/dormitory/dormitories" className="btn-primary text-lg px-8 py-3">
            ดูหอพักทั้งหมด
          </Link>
          <Link to="/demo/dormitory/login" className="btn-secondary text-lg px-8 py-3">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold mb-2">หอพักคุณภาพ</h3>
          <p className="text-gray-600">
            หอพักที่ผ่านการคัดเลือกและตรวจสอบคุณภาพ เพื่อความปลอดภัยและความสะดวกสบาย
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">จองง่าย รวดเร็ว</h3>
          <p className="text-gray-600">
            ระบบจองที่ใช้งานง่าย เพียงไม่กี่คลิกก็สามารถจองห้องพักได้ทันที
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-semibold mb-2">ราคาเป็นมิตร</h3>
          <p className="text-gray-600">
            ราคาที่เหมาะสมสำหรับนักศึกษา พร้อมโปรโมชั่นและส่วนลดพิเศษ
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white rounded-lg p-8 text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
        <p className="text-xl mb-6">
          เข้าร่วมกับเราและค้นหาหอพักที่เหมาะสมสำหรับคุณ
        </p>
        <Link to="/demo/dormitory/login" className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
};

export default Home; 