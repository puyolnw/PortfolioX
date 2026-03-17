import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { LoadingSpinner } from '../components/LoadingEffect';
import useNotification from '../hooks/useNotification';
import { ToastContainer } from '../components/Notification';
import axios from 'axios';

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, showSuccess, showError } = useNotification();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyBookings = async () => {
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('ต้องการยกเลิกการจองนี้หรือไม่?')) {
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        reason: 'ยกเลิกโดยผู้ใช้'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      showSuccess('ยกเลิกการจองสำเร็จ');
      fetchMyBookings();
    } catch (error) {
      console.error('❌ Cancel booking error:', error);
      showError('ไม่สามารถยกเลิกการจองได้');
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
      }
      return '⏳ รออนุมัติ';
    }
    
    const texts = {
      'approved': '✅ อนุมัติแล้ว',
      'rejected': '❌ ถูกปฏิเสธ',
      'cancelled': '🚫 ยกเลิกแล้ว',
      'completed': '🏁 เสร็จสิ้น'
    };
    return texts[status] || status;
  };

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
          <div className="max-w-6xl mx-auto px-4">
            
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                📋 การจองของฉัน
              </h1>
              <p className="text-gray-600 mt-2">
                ดูประวัติและสถานะการจองห้องพักทั้งหมด
              </p>
            </div>

            {/* Bookings List */}
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีการจอง</h3>
                <p className="text-gray-600 mb-4">คุณยังไม่เคยจองห้องพัก</p>
                <button
                  onClick={() => navigate('/demo/dormitory/dormitories')}
                  className="btn-primary"
                >
                  เริ่มจองห้อง
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.booking_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            ห้อง {booking.roomData?.room_number} - {booking.roomData?.roomType?.room_type_name}
                          </h3>
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
                          
                          {/* เวลาคงเหลือในการชำระ */}
                          {booking.payment_deadline && booking.deposit_status === 'none' && 
                           new Date(booking.payment_deadline) > new Date() && (
                            <div className="mt-2 text-xs text-red-600">
                              ⏰ เหลือเวลาชำระ: {Math.floor((new Date(booking.payment_deadline) - new Date()) / (1000 * 60))} นาที
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.booking_status)}`}>
                            {getStatusText(booking)}
                          </span>
                          {(booking.booking_status === 'pending' || 
                            (booking.booking_status === 'pending' && booking.deposit_status === 'none') ||
                            (booking.booking_status === 'pending' && booking.deposit_status === 'pending')) && (
                            <button
                              onClick={() => handleCancelBooking(booking.booking_id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 border border-red-600 rounded hover:bg-red-50"
                            >
                              🚫 ยกเลิก
                            </button>
                          )}
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

                      {/* Payment Info */}
                      {booking.payment_deadline && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <span className="text-sm text-gray-600">ข้อมูลการชำระเงิน:</span>
                          <div className="text-sm text-gray-800 mt-1">
                            <p>กำหนดชำระ: {new Date(booking.payment_deadline).toLocaleString('th-TH')}</p>
                            {booking.payment_slip_uploaded_at && (
                              <p>อัพโหลดสลิป: {new Date(booking.payment_slip_uploaded_at).toLocaleString('th-TH')}</p>
                            )}
                            {booking.manager_approved_at && (
                              <p>อนุมัติโดยผู้จัดการ: {new Date(booking.manager_approved_at).toLocaleString('th-TH')}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Remarks */}
                      {booking.remarks && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-600">หมายเหตุ:</span>
                          <p className="text-sm text-gray-800 mt-1">{booking.remarks}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button
                          onClick={() => navigate(`/room-detail/${booking.room_id}`)}
                          className="btn-secondary text-sm"
                        >
                          ดูรายละเอียดห้อง
                        </button>
                        
                        {/* ปุ่มชำระเงิน - ถ้ายังไม่ชำระ */}
                        {booking.booking_status === 'pending' && booking.deposit_status === 'none' && (
                          <button
                            onClick={() => navigate('/demo/dormitory/payment', { 
                              state: { 
                                bookingId: booking.booking_id,
                                bookingData: booking,
                                roomData: booking.roomData
                              }
                            })}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                          >
                            💳 ชำระเงิน
                          </button>
                        )}
                        
                        {/* ปุ่มดูรายละเอียดการจอง */}
                        <button
                          onClick={() => navigate('/demo/dormitory/booking-details', { 
                            state: { 
                              bookingId: booking.booking_id,
                              roomData: booking.roomData,
                              bookingData: booking
                            }
                          })}
                          className="btn-primary text-sm"
                        >
                          📋 ดูรายละเอียด
                        </button>
                        
                        {/* ปุ่มดูสัญญา - ถ้าอนุมัติแล้ว */}
                        {booking.booking_status === 'approved' && (
                          <button
                            onClick={() => navigate('/demo/dormitory/booking-contract', { 
                              state: { 
                                roomId: booking.room_id,
                                roomData: booking.roomData,
                                bookingData: booking,
                                viewMode: true
                              }
                            })}
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                          >
                            📄 ดูสัญญา
                          </button>
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

export default MyBookings;
