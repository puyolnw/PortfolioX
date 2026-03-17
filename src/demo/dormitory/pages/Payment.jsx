import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { LoadingSpinner, LoadingButton } from '../components/LoadingEffect';
import useNotification from '../hooks/useNotification';
import { ToastContainer } from '../components/Notification';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, showSuccess, showError, showWarning } = useNotification();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [slipPreview, setSlipPreview] = useState('');

  // รับข้อมูลจาก navigation state
  const { bookingId, bookingData, roomData } = location.state || {};

  useEffect(() => {
    if (!bookingId) {
      showError('ไม่พบข้อมูลการจอง');
      navigate('/demo/dormitory/dormitories');
      return;
    }
    
    fetchBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);



  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
      setBooking(response.data);
      
      // ตรวจสอบสถานะการชำระเงิน
      if (response.data.payment_status === 'paid') {
        // สำเร็จแล้ว
      } else if (response.data.payment_status === 'uploaded') {
        // อัปโหลดแล้ว
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      showError('ไม่สามารถโหลดข้อมูลการจองได้');
      navigate('/demo/dormitory/dormitories');
    } finally {
      setLoading(false);
    }
  };



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showError('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (JPEG, PNG)');
      return;
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    setPaymentSlip(file);
    setSlipPreview(URL.createObjectURL(file));
  };

  const handleUploadSlip = async () => {
    if (!paymentSlip) {
      showWarning('กรุณาเลือกไฟล์สลิปการโอนเงิน');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('paymentSlip', paymentSlip);
      formData.append('bookingId', bookingId);

      await axios.post('http://localhost:5000/api/bookings/upload-payment-slip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('อัพโหลดสลิปสำเร็จ รอผู้จัดการตรวจสอบ');
      
      // รีเฟรชข้อมูลการจอง
      fetchBookingDetails();
    } catch (error) {
      console.error('Upload error:', error);
      showError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพโหลด');
    } finally {
      setUploading(false);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">💳 ชำระเงิน</h1>
              <p className="text-gray-600">อัพโหลดหลักฐานการโอนเงิน</p>
            </div>



            {/* Payment Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="font-bold text-gray-900 mb-4">🏦 ข้อมูลการโอนเงิน</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ธนาคาร</p>
                    <p className="font-medium">ธนาคารกรุงไทย</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">เลขที่บัญชี</p>
                    <p className="font-mono font-medium">123-4-56789-0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ชื่อบัญชี</p>
                    <p className="font-medium">มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">จำนวนเงินที่ต้องโอน</p>
                    <p className="text-2xl font-bold text-green-600">
                      ฿{Number(booking.totalPrice || bookingData?.total_price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  💡 <strong>หมายเหตุ:</strong> กรุณาโอนเงินตามจำนวนที่ระบุไว้ข้างต้นให้ตรงถูกต้อง
                </p>
              </div>
            </div>

            {/* Upload Payment Slip */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="font-bold text-gray-900 mb-4">📎 อัพโหลดสลิปการโอนเงิน</h3>
              
              {booking.payment_status === 'uploaded' ? (
                <div className="text-center py-8">
                  <div className="text-green-500 text-6xl mb-4">✅</div>
                  <h4 className="text-lg font-medium text-green-800 mb-2">อัพโหลดสลิปสำเร็จแล้ว</h4>
                  <p className="text-green-700">รอผู้จัดการตรวจสอบและอนุมัติการชำระเงิน</p>
                </div>
              ) : booking.payment_status === 'paid' ? (
                <div className="text-center py-8">
                  <div className="text-green-500 text-6xl mb-4">🎉</div>
                  <h4 className="text-lg font-medium text-green-800 mb-2">ชำระเงินสำเร็จ</h4>
                  <p className="text-green-700">การจองของคุณได้รับการยืนยันแล้ว</p>
                </div>
              
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เลือกไฟล์สลิปการโอนเงิน *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      รองรับไฟล์: JPEG, PNG ขนาดไม่เกิน 5MB
                    </p>
                  </div>

                  {/* Preview */}
                  {slipPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">ตัวอย่างสลิป</p>
                      <div className="max-w-xs mx-auto">
                        <img
                          src={slipPreview}
                          alt="Payment slip preview"
                          className="w-full h-auto rounded-lg border"
                        />
                      </div>
                    </div>
                  )}

                  <LoadingButton
                    onClick={handleUploadSlip}
                    loading={uploading}
                    disabled={!paymentSlip}
                    className="w-full btn-primary text-lg py-3"
                  >
                    📤 อัพโหลดสลิป
                  </LoadingButton>
                </div>
              )}
            </div>

            {/* QR Code (ถ้ามี) */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="font-bold text-gray-900 mb-4">📱 QR Code สำหรับโอนเงิน</h3>
              <div className="text-center">
                <div className="inline-block p-4 bg-gray-200 rounded-lg">
                  <div className="w-48 h-48 bg-white rounded flex items-center justify-center">
                    <p className="text-gray-500 text-sm">QR Code<br/>PromptPay</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">สแกน QR Code เพื่อโอนเงิน</p>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">📋 สรุปการจอง</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ห้อง:</span>
                  <span className="font-medium">ห้อง {roomData?.room_number} ({roomData?.roomType?.room_type_name})</span>
                </div>
                <div className="flex justify-between">
                  <span>วันที่เข้าพัก:</span>
                  <span className="font-medium">{new Date(booking?.checkInDate || bookingData?.check_in_date).toLocaleDateString('th-TH')}</span>
                </div>
                <div className="flex justify-between">
                  <span>วันที่ออก:</span>
                  <span className="font-medium">{new Date(booking?.checkOutDate || bookingData?.check_out_date).toLocaleDateString('th-TH')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">ราคารวม:</span>
                  <span className="text-lg font-bold text-green-600">
                    ฿{Number(booking?.totalPrice || bookingData?.total_price || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/demo/dormitory/booking-details', { state: { bookingId } })}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                ← กลับไปดูรายละเอียดการจอง
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
      
      <ToastContainer notifications={notifications} />
    </div>
  );
};

export default Payment;
