import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { LoadingSpinner, LoadingButton } from '../components/LoadingEffect';
import useNotification from '../hooks/useNotification';
import { ToastContainer } from '../components/Notification';
import axios from 'axios';

const PaymentPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const { notifications, showSuccess, showError } = useNotification();
  
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  useEffect(() => {
    fetchBillDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId]);

  const fetchBillDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/bills/my-bills`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const targetBill = response.data.bills.find(b => b.bill_id === parseInt(billId));
      if (!targetBill) {
        showError('ไม่พบบิลนี้หรือไม่ใช่บิลของคุณ');
        navigate('/demo/dormitory/student-bills');
        return;
      }

      if (targetBill.bill_status === 'paid') {
        showError('บิลนี้ชำระเรียบร้อยแล้ว');
        navigate('/demo/dormitory/student-bills');
        return;
      }

      setBill(targetBill);

    } catch (error) {
      console.error('Failed to fetch bill details:', error);
      showError('ไม่สามารถโหลดข้อมูลบิลได้');
      navigate('/demo/dormitory/student-bills');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('ไฟล์มีขนาดใหญ่เกิน 5MB');
      return;
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      showError('รองรับเฉพาะไฟล์ JPG, PNG, GIF, PDF');
      return;
    }

    setPaymentSlip(file);

    // สร้างตัวอย่างรูปภาพ
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadSlip = async () => {
    if (!paymentSlip) {
      showError('กรุณาเลือกไฟล์สลิปการชำระ');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('payment_slip', paymentSlip);

      await axios.post(`http://localhost:5000/api/bills/${billId}/payment`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showSuccess('อัปโหลดสลิปการชำระสำเร็จ รอการอนุมัติ');
      
      // กลับไปหน้าบิล
      setTimeout(() => {
        navigate('/demo/dormitory/student-bills');
      }, 2000);

    } catch (error) {
      console.error('Failed to upload payment slip:', error);
      showError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปโหลดสลิป');
    } finally {
      setUploading(false);
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
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

  if (!bill) {
    return (
      <div>
        <Navbar />
        <PageTransition>
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">❌</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบบิลนี้</h3>
              <button onClick={() => navigate('/demo/dormitory/student-bills')} className="btn-primary">
                กลับไปหน้าบิล
              </button>
            </div>
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
          <div className="max-w-2xl mx-auto px-4">
            
            {/* หัวข้อ */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                💳 ชำระค่าใช้จ่าย
              </h1>
              <p className="text-gray-600">
                อัปโหลดหลักฐานการโอนเงินเพื่อชำระบิล
              </p>
            </div>

            {/* ข้อมูลบิล */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    ห้อง {bill.room.room_number}
                  </h2>
                  <p className="text-gray-600">
                    {bill.room.roomType.room_type_name} • {months[bill.bill_month - 1]} {bill.bill_year + 543}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {formatCurrency(bill.total_amount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    ครบกำหนด: {new Date(bill.due_date).toLocaleDateString('th-TH')}
                  </div>
                  {isOverdue(bill.due_date) && (
                    <div className="text-red-600 text-sm font-medium">
                      เลยกำหนด {bill.penalty_days} วัน
                    </div>
                  )}
                </div>
              </div>

              {/* รายละเอียดค่าใช้จ่าย */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">รายละเอียดค่าใช้จ่าย</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ค่าเช่าห้อง</span>
                    <span className="font-medium">{formatCurrency(bill.room_rent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ค่าน้ำ</span>
                    <span className="font-medium">{formatCurrency(bill.water_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ค่าไฟ</span>
                    <span className="font-medium">{formatCurrency(bill.electricity_cost)}</span>
                  </div>
                  {bill.other_charges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่าใช้จ่ายอื่น</span>
                      <span className="font-medium">{formatCurrency(bill.other_charges)}</span>
                    </div>
                  )}
                  {bill.penalty_amount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>ค่าปรับ ({bill.penalty_days} วัน)</span>
                      <span className="font-medium">{formatCurrency(bill.penalty_amount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>ยอดรวม</span>
                    <span>{formatCurrency(bill.total_amount)}</span>
                  </div>
                </div>

                {/* เหตุผลค่าใช้จ่ายอื่น */}
                {bill.other_charges_reason && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-sm">
                      <strong className="text-yellow-800">หมายเหตุ:</strong>
                      <span className="text-yellow-700 ml-1">{bill.other_charges_reason}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* อัปโหลดสลิป */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📎 อัปโหลดหลักฐานการโอนเงิน
              </h3>

              {/* ข้อมูลบัญชีปลายทาง */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-800 mb-2">ข้อมูลบัญชีปลายทาง</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>🏦 ธนาคาร: กสิกรไทย</div>
                  <div>💳 เลขบัญชี: 123-4-56789-0</div>
                  <div>👤 ชื่อบัญชี: หอพักนักศึกษา มหาวิทยาลัย ABC</div>
                  <div>💰 จำนวนเงิน: <strong>{formatCurrency(bill.total_amount)}</strong></div>
                </div>
              </div>

              {/* เลือกไฟล์ */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกไฟล์สลิปการโอนเงิน
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="payment-slip-input"
                  />
                  <label htmlFor="payment-slip-input" className="cursor-pointer">
                    {paymentSlip ? (
                      <div className="space-y-2">
                        <div className="text-green-600 text-4xl">✅</div>
                        <div className="text-sm font-medium text-gray-900">
                          {paymentSlip.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ขนาด: {(paymentSlip.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-gray-400 text-4xl">📎</div>
                        <div className="text-sm font-medium text-gray-900">
                          คลิกเพื่อเลือกไฟล์
                        </div>
                        <div className="text-xs text-gray-500">
                          รองรับ JPG, PNG, GIF, PDF (สูงสุด 5MB)
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* ตัวอย่างรูปภาพ */}
              {previewUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ตัวอย่างไฟล์
                  </label>
                  <div className="max-w-sm mx-auto">
                    <img 
                      src={previewUrl} 
                      alt="ตัวอย่างสลิป" 
                      className="w-full rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* คำแนะนำ */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ ข้อควรระวัง</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• ตรวจสอบให้แน่ใจว่าจำนวนเงินในสลิปตรงกับยอดที่ต้องชำระ</li>
                  <li>• รูปภาพต้องชัดเจน อ่านเลขบัญชีและจำนวนเงินได้</li>
                  <li>• หากสลิปไม่ถูกต้อง จะต้องอัปโหลดใหม่</li>
                  <li>• การอนุมัติใช้เวลา 1-2 วันทำการ</li>
                </ul>
              </div>

              {/* ปุ่มดำเนินการ */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/demo/dormitory/student-bills')}
                  className="btn-secondary flex-1"
                >
                  ❌ ยกเลิก
                </button>
                <LoadingButton
                  loading={uploading}
                  onClick={handleUploadSlip}
                  disabled={!paymentSlip}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  ✅ อัปโหลดสลิป
                </LoadingButton>
              </div>
            </div>

            {/* ข้อมูลการติดต่อ */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📞 ติดต่อสอบถาม
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div>📱 โทรศัพท์: 02-123-4567</div>
                <div>📧 อีเมล: dormitory@university.ac.th</div>
                <div>🕐 เวลาทำการ: จันทร์-ศุกร์ 08:00-17:00 น.</div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer notifications={notifications} />
      </PageTransition>
    </div>
  );
};

export default PaymentPage;
