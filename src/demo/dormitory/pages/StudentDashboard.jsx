import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { CardSkeleton } from '../components/LoadingEffect';
import useNotification from '../hooks/useNotification';
import { ToastContainer } from '../components/Notification';
import {
  FaHome,
  FaFileInvoiceDollar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaEye,
  FaCalendarAlt,
  FaTachometerAlt
} from 'react-icons/fa';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { notifications, showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/dashboard/student', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('ไม่สามารถโหลดข้อมูล Dashboard ได้');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBillStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillStatusText = (status) => {
    switch (status) {
      case 'paid':
        return '✅ ชำระแล้ว';
      case 'pending_approval':
        return '⏳ รออนุมัติ';
      case 'issued':
        return '📋 รอชำระ';
      case 'overdue':
        return '⚠️ เลยกำหนด';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <PageTransition>
          <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <CardSkeleton rows={2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                  <CardSkeleton key={index} rows={4} />
                ))}
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.roomInfo) {
    return (
      <div>
        <Navbar />
        <PageTransition>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <FaHome className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีห้องพัก</h2>
              <p className="text-gray-600 mb-4">คุณยังไม่ได้จองห้องพักในหอพัก</p>
              <button
                onClick={() => navigate('/demo/dormitory/dormitories')}
                className="btn-primary"
              >
                ดูห้องพักที่ว่าง
              </button>
            </div>
          </div>
        </PageTransition>
      </div>
    );
  }

  const { roomInfo, bills, latestMeterReading } = dashboardData;

  const overdueBills = bills.filter(bill => bill.bill_status === 'overdue' || 
    (bill.bill_status === 'issued' && bill.days_overdue > 0));

  const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick, isClickable = false }) => (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 ${
        isClickable ? 'hover:shadow-lg cursor-pointer transform hover:scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color || 'text-gray-900'}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && <Icon className={`h-8 w-8 ${color || 'text-gray-400'}`} />}
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <PageTransition>
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard นักศึกษา</h1>
              <p className="text-gray-600">ข้อมูลห้องพักและบิลค่าใช้จ่ายของคุณ</p>
            </div>

            {/* Room Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaHome className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">ข้อมูลห้องพัก</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  roomInfo.room_status === 'occupied' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {roomInfo.room_status === 'occupied' ? '🏠 กำลังอยู่อาศัย' : '📝 จองแล้ว'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">ห้อง {roomInfo.room_number}</h3>
                  <p className="text-gray-600">{roomInfo.type_name}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {formatCurrency(roomInfo.room_rent)}
                    <span className="text-sm text-gray-500 font-normal">/เดือน</span>
                  </p>
                </div>

                {latestMeterReading && (
                  <div className="md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-700 mb-3">มิเตอร์ล่าสุด</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">มิเตอร์น้ำ</p>
                            <p className="text-xl font-bold text-blue-800">
                              {latestMeterReading.current_water_reading}
                            </p>
                          </div>
                          <FaTachometerAlt className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-yellow-600 font-medium">มิเตอร์ไฟ</p>
                            <p className="text-xl font-bold text-yellow-800">
                              {latestMeterReading.current_electricity_reading}
                            </p>
                          </div>
                          <FaTachometerAlt className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      อัปเดต: {formatDate(latestMeterReading.recorded_date)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bills Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="บิลทั้งหมด"
                value={bills.length}
                subtitle="รายการ"
                icon={FaFileInvoiceDollar}
                color="text-blue-600"
              />
              <StatCard
                title="บิลค้างชำระ"
                value={overdueBills.length}
                subtitle="รายการ"
                icon={FaExclamationTriangle}
                color={overdueBills.length > 0 ? "text-red-600" : "text-green-600"}
                onClick={() => navigate('/demo/dormitory/student-bills')}
                isClickable={overdueBills.length > 0}
              />
              <StatCard
                title="บิลที่ชำระแล้ว"
                value={bills.filter(bill => bill.bill_status === 'paid').length}
                subtitle="รายการ"
                icon={FaCheckCircle}
                color="text-green-600"
              />
            </div>

            {/* Recent Bills */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">บิลล่าสุด</h3>
                  </div>
                  <button
                    onClick={() => navigate('/demo/dormitory/student-bills')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    ดูทั้งหมด <FaEye className="ml-1 h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {bills.length === 0 ? (
                  <div className="text-center py-8">
                    <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">ยังไม่มีบิลค่าใช้จ่าย</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bills.slice(0, 5).map((bill, index) => (
                      <div key={bill.bill_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                บิลเดือน {bill.bill_month}/{bill.bill_year}
                              </h4>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillStatusColor(bill.bill_status)}`}>
                                {getBillStatusText(bill.bill_status)}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                              <div>
                                <span className="text-gray-500">ค่าเช่า:</span>
                                <div className="font-medium">{formatCurrency(bill.room_rent)}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">ค่าน้ำ:</span>
                                <div className="font-medium">{formatCurrency(bill.water_cost)}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">ค่าไฟ:</span>
                                <div className="font-medium">{formatCurrency(bill.electricity_cost)}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">รวม:</span>
                                <div className="font-bold text-lg text-blue-600">
                                  {formatCurrency(bill.total_amount)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">
                                กำหนดชำระ: {formatDate(bill.due_date)}
                              </span>
                              {bill.paid_date && (
                                <span className="text-green-600">
                                  ชำระเมื่อ: {formatDate(bill.paid_date)}
                                </span>
                              )}
                              {bill.days_overdue > 0 && (
                                <span className="text-red-600 font-medium">
                                  เลยกำหนด {bill.days_overdue} วัน
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {bills.length > 5 && (
                      <div className="text-center pt-4 border-t">
                        <button
                          onClick={() => navigate('/demo/dormitory/student-bills')}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ดูบิลทั้งหมด ({bills.length} รายการ)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ToastContainer notifications={notifications} />
        </div>
      </PageTransition>
    </div>
  );
};

export default StudentDashboard;
