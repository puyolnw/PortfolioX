import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { LoadingSpinner } from '../components/LoadingEffect';
import useNotification from '../hooks/useNotification';
import { ToastContainer } from '../components/Notification';
import axios from 'axios';

const ManageBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, showSuccess, showError } = useNotification();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    if (user && (user.role === 'Manager' || user.role === 'Admin')) {
      fetchAllBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // รวมข้อมูลจาก Room และ RoomType
      const bookingsWithDetails = await Promise.all(
        response.data.map(async (booking) => {
          try {
            const roomResponse = await axios.get(`http://localhost:5000/api/rooms/${booking.room_id}`);
            return {
              ...booking,
              roomData: roomResponse.data
            };
          } catch (err) {
            console.error('Failed to fetch room data:', err);
            return booking;
          }
        })
      );
      
      setBookings(bookingsWithDetails);
    } catch (error) {
      console.error('❌ Failed to fetch bookings:', error);
      showError('ไม่สามารถโหลดข้อมูลการจองได้');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (bookingId) => {
    if (!window.confirm('ยืนยันการอนุมัติการชำระเงิน?')) return;
    
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/approve-payment`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      showSuccess('อนุมัติการชำระเงินสำเร็จ');
      fetchAllBookings(); // Reload data
    } catch (error) {
      console.error('Failed to approve payment:', error);
      showError('ไม่สามารถอนุมัติการชำระเงินได้');
    }
  };

  const handleRejectPayment = async (bookingId) => {
    const reason = window.prompt('เหตุผลในการปฏิเสธ:');
    if (!reason) return;
    
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/reject-payment`, {
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      showSuccess('ปฏิเสธการชำระเงินสำเร็จ');
      fetchAllBookings(); // Reload data
    } catch (error) {
      console.error('Failed to reject payment:', error);
      showError('ไม่สามารถปฏิเสธการชำระเงินได้');
    }
  };

  const handleApproveBooking = async (bookingId) => {
    if (!window.confirm('ยืนยันการอนุมัติการจอง?')) return;
    
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      showSuccess('อนุมัติการจองสำเร็จ');
      fetchAllBookings(); // Reload data
    } catch (error) {
      console.error('Failed to approve booking:', error);
      showError('ไม่สามารถอนุมัติการจองได้');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = window.prompt('เหตุผลในการปฏิเสธ:');
    if (!reason) return;
    
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      showSuccess('ปฏิเสธการจองสำเร็จ');
      fetchAllBookings(); // Reload data
    } catch (error) {
      console.error('Failed to reject booking:', error);
      showError('ไม่สามารถปฏิเสธการจองได้');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (booking) => {
    const status = booking.booking_status;
    const depositStatus = booking.deposit_status;
    
    if (status === 'pending') {
      if (depositStatus === 'none') {
        return '💳 รอชำระเงิน';
      } else if (depositStatus === 'pending') {
        return '🔍 รอตรวจสอบสลิป';
      } else if (depositStatus === 'paid') {
        return '⏳ รออนุมัติการจอง';
      }
      return '⏳ รอดำเนินการ';
    }
    
    const texts = {
      'approved': '✅ อนุมัติแล้ว',
      'rejected': '❌ ถูกปฏิเสธ',
      'cancelled': '🚫 ยกเลิกแล้ว',
      'completed': '🏁 เสร็จสิ้น'
    };
    return texts[status] || status;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.booking_status === 'pending';
    if (filter === 'approved') return booking.booking_status === 'approved';
    if (filter === 'rejected') return booking.booking_status === 'rejected';
    return true;
  });

  if (loading) {
    return (
      <div>
        <Navbar />
        <PageTransition>
          <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner size="large" />
          </div>
        </PageTransition>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <PageTransition>
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                🔍 จัดการการจอง
              </h1>
              <p className="text-gray-600 mt-2">
                ตรวจสอบและอนุมัติการจองห้องพัก
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ทั้งหมด ({bookings.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                รอดำเนินการ ({bookings.filter(b => b.booking_status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'approved' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                อนุมัติแล้ว ({bookings.filter(b => b.booking_status === 'approved').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'rejected' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ปฏิเสธแล้ว ({bookings.filter(b => b.booking_status === 'rejected').length})
              </button>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีการจอง</h3>
                <p className="text-gray-600">ไม่มีการจองที่ตรงกับตัวกรองที่เลือก</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.booking_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            ห้อง {booking.roomData?.room_number} - {booking.roomData?.roomType?.room_type_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            โดย: {booking.member?.mem_name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            จองเมื่อ: {new Date(booking.booking_date || booking.createdAt).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            ID: #{booking.booking_id}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.booking_status)}`}>
                            {getStatusText(booking)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">วันที่เข้าพัก:</span>
                          <div className="font-medium">
                            {new Date(booking.check_in_date).toLocaleDateString('th-TH')}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">วันที่ออก:</span>
                          <div className="font-medium">
                            {new Date(booking.check_out_date).toLocaleDateString('th-TH')}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">ระยะเวลา:</span>
                          <div className="font-medium">
                            {Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24 * 30))} เดือน
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">ราคารวม:</span>
                          <div className="font-medium text-green-600">
                            ฿{Number(booking.total_price || booking.roomData?.roomType?.price_per_month * Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24 * 30)) || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Room Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          👥 {booking.roomData?.roomType?.capacity} คน
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          🏷️ {booking.roomData?.roomType?.room_category}
                        </span>
                        {booking.roomData?.roomType?.air_condition && (
                          <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs">
                            ❄️ แอร์
                          </span>
                        )}
                        {booking.roomData?.roomType?.fan && !booking.roomData?.roomType?.air_condition && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            🌀 พัดลม
                          </span>
                        )}
                        
                        {/* สถานะการชำระเงิน */}
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.deposit_status === 'paid' ? 'bg-green-100 text-green-800' :
                          booking.deposit_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          💰 {booking.deposit_status === 'paid' ? 'ชำระแล้ว' :
                               booking.deposit_status === 'pending' ? 'รอตรวจสอบ' :
                               'ยังไม่ชำระ'}
                        </span>
                      </div>

                      {/* Payment Timeline */}
                      {booking.payment_deadline && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <span className="text-sm text-gray-600">ไทม์ไลน์การชำระเงิน:</span>
                          <div className="text-sm text-gray-800 mt-1 space-y-1">
                            <p>📅 กำหนดชำระ: {new Date(booking.payment_deadline).toLocaleString('th-TH')}</p>
                            {booking.payment_slip_uploaded_at && (
                              <p>📁 อัพโหลดสลิป: {new Date(booking.payment_slip_uploaded_at).toLocaleString('th-TH')}</p>
                            )}
                            {booking.manager_approved_at && (
                              <p>✅ อนุมัติโดย: {booking.manager_name || 'ผู้จัดการ'} เมื่อ {new Date(booking.manager_approved_at).toLocaleString('th-TH')}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Remarks */}
                      {booking.remarks && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <span className="text-sm text-gray-600">หมายเหตุ:</span>
                          <p className="text-sm text-gray-800 mt-1">{booking.remarks}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          onClick={() => navigate('/demo/dormitory/booking-details', { 
                            state: { 
                              bookingId: booking.booking_id,
                              roomData: booking.roomData,
                              bookingData: booking
                            }
                          })}
                          className="btn-secondary text-sm"
                        >
                          📋 ดูรายละเอียด
                        </button>
                        
                        {/* ปุ่มอนุมัติการชำระเงิน - ถ้ามีสลิปรอตรวจสอบ */}
                        {booking.deposit_status === 'pending' && booking.booking_status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprovePayment(booking.booking_id)}
                              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                            >
                              ✅ อนุมัติการชำระ
                            </button>
                            <button
                              onClick={() => handleRejectPayment(booking.booking_id)}
                              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                            >
                              ❌ ปฏิเสธการชำระ
                            </button>
                          </div>
                        )}
                        
                        {/* ปุ่มอนุมัติการจอง - ถ้าชำระเงินแล้ว */}
                        {booking.deposit_status === 'paid' && booking.booking_status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveBooking(booking.booking_id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                            >
                              🏠 อนุมัติการจอง
                            </button>
                            <button
                              onClick={() => handleRejectBooking(booking.booking_id)}
                              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                            >
                              ❌ ปฏิเสธการจอง
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
      
      <ToastContainer notifications={notifications} />
    </div>
  );
};

export default ManageBookings;
