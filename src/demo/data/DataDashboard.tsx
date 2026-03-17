import { useNavigate } from 'react-router-dom';
import {
  IconSchool,
  IconActivity, IconRefresh, IconEye
} from '@tabler/icons-react';

const statCards = [
  { label: 'นักศึกษาที่ลงทะเบียน', value: 247, bg: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', icon: '🎓' },
  { label: 'ผู้ประกอบการที่ลงทะเบียน', value: 58, bg: 'linear-gradient(135deg, #f093fb, #f5576c)', color: '#fff', icon: '🏢' },
  { label: 'งานที่กำลังเปิดรับสมัคร', value: 34, bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#fff', icon: '💼' },
  { label: 'งานรอการพิจารณา', value: 8, bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', color: '#333', icon: '⏳' },
  { label: 'ใบสมัครรอพิจารณา', value: 23, bg: 'linear-gradient(135deg, #a8edea, #fed6e3)', color: '#333', icon: '📋' },
  { label: 'งานที่ถูกปฏิเสธ', value: 3, bg: 'linear-gradient(135deg, #ff9a9e, #fecfef)', color: '#333', icon: '❌' },
  { label: 'งานใหม่สัปดาห์นี้', value: 12, bg: 'linear-gradient(135deg, #d299c2, #fef9d7)', color: '#333', icon: '🆕' },
  { label: 'อัตราการจับคู่สำเร็จ', value: '68%', bg: 'linear-gradient(135deg, #89f7fe, #66a6ff)', color: '#fff', icon: '✅' },
];

const workingStudents = [
  { name: 'สมชาย ใจดี', studentId: '6501001', position: 'Web Developer', company: 'บริษัท ซอฟต์แวร์ จำกัด', startDate: '01/02/2569', endDate: '30/04/2569', status: 'active' },
  { name: 'สมหญิง รักเรียน', studentId: '6501002', position: 'Graphic Designer', company: 'บริษัท ดีไซน์ จำกัด', startDate: '15/01/2569', endDate: '15/04/2569', status: 'active' },
  { name: 'วิชัย แก้วมณี', studentId: '6501003', position: 'Data Entry', company: 'ร้าน ABC Mart', startDate: '01/03/2569', endDate: '31/05/2569', status: 'active' },
  { name: 'นริศรา พลอยสวย', studentId: '6501004', position: 'Marketing Intern', company: 'บริษัท มาร์เก็ตติ้ง จำกัด', startDate: '01/02/2569', endDate: '30/04/2569', status: 'active' },
];

const appliedStudents = [
  { name: 'กานต์ สายลม', studentId: '6501005', position: 'ผู้ช่วยบัญชี', company: 'สำนักงานบัญชี ABC', appliedDate: '10/03/2569', status: 'pending' },
  { name: 'ปิยะ ดวงดาว', studentId: '6501006', position: 'IT Support', company: 'บริษัท เทค จำกัด', appliedDate: '08/03/2569', status: 'admin_approved' },
  { name: 'ธนพล สุขสวัสดิ์', studentId: '6501007', position: 'Sales Staff', company: 'ห้างสรรพสินค้า XYZ', appliedDate: '05/03/2569', status: 'pending' },
];

export default function DataDashboard() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: '#dcfce7', text: '#16a34a', label: 'กำลังปฏิบัติงาน' },
      pending: { bg: '#fef9c3', text: '#ca8a04', label: 'รอพิจารณา' },
      admin_approved: { bg: '#dbeafe', text: '#2563eb', label: 'อนุมัติโดยผู้ดูแล' },
    };
    const s = map[status] || { bg: '#f1f5f9', text: '#64748b', label: status };
    return (
      <span style={{
        padding: '4px 12px', borderRadius: 20,
        background: s.bg, color: s.text,
        fontSize: '0.75rem', fontWeight: 700,
      }}>{s.label}</span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#212b36' }}>หน้าหลักผู้ดูแลระบบ</h1>
          <p style={{ margin: '4px 0 0', color: '#919eab', fontSize: '0.9rem' }}>ภาพรวมระบบและสถิติการใช้งาน</p>
        </div>
        <button onClick={() => window.location.reload()} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8,
          border: '1px solid #e0e0e0', background: 'white',
          cursor: 'pointer', fontSize: '0.85rem', color: '#637381',
        }}><IconRefresh size={16} /> รีเฟรช</button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: card.bg, color: card.color,
            borderRadius: 16, padding: '20px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s',
            cursor: 'default',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: '0.82rem', marginTop: 6, opacity: 0.9 }}>{card.label}</div>
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
              }}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Working Students Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconActivity size={20} color="#1976d2" />
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>นักศึกษาที่กำลังปฏิบัติงาน</h3>
          <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 6, background: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem', fontWeight: 700 }}>{workingStudents.length} คน</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#1976d2' }}>
                {['ชื่อนักศึกษา', 'รหัสนักศึกษา', 'ตำแหน่งงาน', 'บริษัท', 'วันที่เริ่มงาน', 'วันที่สิ้นสุด', 'สถานะ', 'จัดการ'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workingStudents.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>{s.name.charAt(0)}</div>
                      {s.name}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#919eab' }}>{s.studentId}</td>
                  <td style={{ padding: '12px 16px' }}>{s.position}</td>
                  <td style={{ padding: '12px 16px' }}>{s.company}</td>
                  <td style={{ padding: '12px 16px' }}>{s.startDate}</td>
                  <td style={{ padding: '12px 16px' }}>{s.endDate}</td>
                  <td style={{ padding: '12px 16px' }}>{getStatusBadge(s.status)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => navigate('/demo/data/students')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2' }}><IconEye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applied Students Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconSchool size={20} color="#f5576c" />
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>นักศึกษาที่สมัครงาน (รอพิจารณา)</h3>
          <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 6, background: '#fef3c7', color: '#d97706', fontSize: '0.75rem', fontWeight: 700 }}>{appliedStudents.length} ใบสมัคร</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {['ชื่อนักศึกษา', 'รหัส', 'ตำแหน่งที่สมัคร', 'สถานประกอบการ', 'วันที่สมัคร', 'สถานะ'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appliedStudents.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '12px 16px', color: '#919eab' }}>{s.studentId}</td>
                  <td style={{ padding: '12px 16px' }}>{s.position}</td>
                  <td style={{ padding: '12px 16px' }}>{s.company}</td>
                  <td style={{ padding: '12px 16px' }}>{s.appliedDate}</td>
                  <td style={{ padding: '12px 16px' }}>{getStatusBadge(s.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
