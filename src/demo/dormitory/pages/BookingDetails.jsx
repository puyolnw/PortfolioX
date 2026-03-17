import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { LoadingSpinner } from '../components/LoadingEffect';
import useNotification from '../hooks/useNotification';
import { ToastContainer } from '../components/Notification';
import axios from 'axios';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, showSuccess, showError } = useNotification();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 นาที ในวินาที
  const [paymentExpired, setPaymentExpired] = useState(false);

  // รับข้อมูลจาก navigation state
  const { bookingId, roomData, bookingData } = location.state || {};

  useEffect(() => {
    if (!bookingId) {
      showError('ไม่พบข้อมูลการจอง');
      navigate('/demo/dormitory/dormitories');
      return;
    }
    
    fetchBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // Timer นับถอยหลัง
  useEffect(() => {
    if (booking && booking.deposit_status === 'none' && booking.booking_status === 'pending' && !paymentExpired) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentExpired(true);
            cancelBookingDueToTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking, paymentExpired]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
      const bookingData = response.data;
      
      // ข้อมูล member จะมาจาก join ใน API แล้ว
      // ไม่จำเป็นต้องดึงแยก
      
      setBooking(bookingData);
      
      // ตรวจสอบว่าชำระเงินแล้วหรือยัง
      if (bookingData.deposit_status === 'paid') {
        setPaymentExpired(false);
        setTimeLeft(0);
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      showError('ไม่สามารถโหลดข้อมูลการจองได้');
      navigate('/demo/dormitory/dormitories');
    } finally {
      setLoading(false);
    }
  };

  const cancelBookingDueToTimeout = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        reason: 'ยกเลิกอัตโนมัติเนื่องจากไม่ชำระเงินภายในเวลาที่กำหนด'
      });
      showError('การจองถูกยกเลิกเนื่องจากหมดเวลาชำระเงิน');
    } catch (error) {
      console.error('Auto cancel error:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePayment = () => {
    navigate('/demo/dormitory/payment', {
      state: {
        bookingId: bookingId,
        bookingData: booking,
        roomData: roomData
      }
    });
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
      fetchBookingDetails(); // Reload data
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
      fetchBookingDetails(); // Reload data
    } catch (error) {
      console.error('Failed to reject payment:', error);
      showError('ไม่สามารถปฏิเสธการชำระเงินได้');
    }
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

  if (!booking) {
    return (
      <div>
        <Navbar />
        <PageTransition>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">ไม่พบข้อมูลการจอง</h3>
            <button onClick={() => navigate('/demo/dormitory/dormitories')} className="mt-4 btn-primary">
              กลับหน้าหลัก
            </button>
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
          <div className="max-w-4xl mx-auto px-4">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 รายละเอียดการจอง</h1>
              <p className="text-gray-600">การจองของคุณได้รับการยืนยันแล้ว</p>
            </div>

            {/* Payment Timer */}
            {booking.deposit_status === 'none' && booking.booking_status === 'pending' && !paymentExpired && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-red-900 mb-2">⏰ เวลาในการชำระเงิน</h3>
                  <div className="text-4xl font-mono font-bold text-red-600 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-red-700">กรุณาชำระเงินภายในเวลาที่กำหนด มิฉะนั้นการจองจะถูกยกเลิก</p>
                </div>
              </div>
            )}

            {/* Payment Expired */}
            {paymentExpired && (
              <div className="bg-gray-100 border border-gray-300 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">⏰ หมดเวลาชำระเงิน</h3>
                  <p className="text-gray-700">การจองถูกยกเลิกเนื่องจากไม่ชำระเงินภายในเวลาที่กำหนด</p>
                  <button 
                    onClick={() => navigate('/demo/dormitory/dormitories')} 
                    className="mt-4 btn-primary"
                  >
                    จองห้องใหม่
                  </button>
                </div>
              </div>
            )}

            {/* Payment Slip Display */}
            {booking.deposit_status === 'pending' && booking.payment_slip_url && (
              <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📷 สลิปการชำระเงิน</h3>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/2">
                    <img 
                      src={`http://localhost:5000${booking.payment_slip_url}`}
                      alt="สลิปการชำระเงิน"
                      className="w-full max-w-md mx-auto border border-gray-300 rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-center text-gray-500 mt-4">
                      ไม่สามารถแสดงรูปภาพได้
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">วันที่อัพโหลด</p>
                        <p className="font-medium">
                          {booking.payment_slip_uploaded_at ? 
                            new Date(booking.payment_slip_uploaded_at).toLocaleString('th-TH') : 
                            'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">สถานะการตรวจสอบ</p>
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          🔍 รอตรวจสอบ
                        </span>
                      </div>
                    </div>
                    
                    {/* Admin/Manager Action Buttons */}
                    {(user?.role === 'Admin' || user?.role === 'Manager') && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">การดำเนินการ</h4>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleApprovePayment(booking.booking_id)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            ✅ อนุมัติการชำระ
                          </button>
                          <button
                            onClick={() => handleRejectPayment(booking.booking_id)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            ❌ ปฏิเสธการชำระ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Success */}
            {booking.deposit_status === 'paid' && booking.booking_status === 'pending' && (
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-900 mb-2">✅ ชำระเงินสำเร็จ</h3>
                  <p className="text-green-700">รอผู้จัดการตรวจสอบและอนุมัติการจอง</p>
                </div>
              </div>
            )}

            {/* Booking Approved - Success Card for Student */}
            {booking.deposit_status === 'paid' && booking.booking_status === 'approved' && (
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-2xl mb-6 text-white shadow-xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-2">การจองสำเร็จ!</h2>
                  <p className="text-xl mb-4">ยินดีต้อนรับสู่หอพักนักศึกษา</p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
                    <p className="text-lg font-semibold">📍 ห้อง {roomData?.room_number}</p>
                    <p className="text-sm">เข้าพักได้ตั้งแต่ {new Date(booking.check_in_date || bookingData?.check_in_date).toLocaleDateString('th-TH')}</p>
                  </div>
                  <p className="text-sm opacity-90">📱 แสดงหน้านี้เมื่อเข้าหอพัก</p>
                </div>
              </div>
            )}

            {/* Booking Information */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="font-bold text-gray-900 mb-4">📝 ข้อมูลการจอง</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">รหัสการจอง</p>
                    <p className="font-mono font-medium text-lg">#{booking.booking_id || bookingData?.booking_id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">ห้อง</p>
                    <p className="font-medium">ห้อง {roomData?.room_number} ({roomData?.roomType?.room_type_name})</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">ผู้จอง</p>
                    <p className="font-medium">
                      {booking.member?.mem_name || 
                       user?.mem_name || 
                       `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">อีเมล</p>
                    <p className="font-medium">
                      {booking.member?.mem_email || 
                       user?.mem_email || 
                       user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">วันที่เข้าพัก</p>
                    <p className="font-medium">{new Date(booking.check_in_date || bookingData?.check_in_date).toLocaleDateString('th-TH')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">วันที่ออก</p>
                    <p className="font-medium">{new Date(booking.check_out_date || bookingData?.check_out_date).toLocaleDateString('th-TH')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">สถานะการจอง</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      booking.booking_status === 'approved' ? 'bg-green-100 text-green-800' :
                      booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.booking_status === 'rejected' ? 'bg-red-100 text-red-800' :
                      booking.booking_status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.booking_status === 'approved' ? '✅ อนุมัติแล้ว' :
                       booking.booking_status === 'pending' ? '⏳ รอดำเนินการ' :
                       booking.booking_status === 'rejected' ? '❌ ถูกปฏิเสธ' :
                       booking.booking_status === 'cancelled' ? '🚫 ยกเลิกแล้ว' :
                       booking.booking_status || bookingData?.booking_status}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">สถานะการชำระเงิน</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      booking.deposit_status === 'paid' ? 'bg-green-100 text-green-800' :
                      booking.deposit_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.deposit_status === 'paid' ? '✅ ชำระแล้ว' :
                       booking.deposit_status === 'pending' ? '🔍 รอตรวจสอบ' :
                       '❌ ไม่ได้ชำระ'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ราคารวม */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">ราคารวม</span>
                  <span className="text-2xl font-bold text-green-600">
                    ฿{Number(booking.total_price || bookingData?.total_price || 
                       (roomData?.roomType?.price_per_month * Math.ceil((new Date(booking.check_out_date || bookingData?.check_out_date) - new Date(booking.check_in_date || bookingData?.check_in_date)) / (1000 * 60 * 60 * 24 * 30))) || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* หมายเหตุ */}
              {(booking.remarks || booking.specialRequests) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">หมายเหตุ</p>
                  <p className="text-gray-800">{booking.remarks || booking.specialRequests}</p>
                </div>
              )}
            </div>


            {/* Payment Button */}
            {booking.deposit_status === 'none' && booking.booking_status === 'pending' && !paymentExpired && (
              <div className="text-center">
                <button
                  onClick={handlePayment}
                  className="btn-primary text-xl py-4 px-8"
                >
                  💳 ไปหน้าชำระเงิน
                </button>
              </div>
            )}

            {/* Back to bookings */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/demo/dormitory/bookings')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                ← ดูการจองทั้งหมดของฉัน
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
      
      <ToastContainer notifications={notifications} />
    </div>
  );
};

export default BookingDetails;
