import { useState } from 'react';
import { IconSearch, IconEye, IconEdit, IconBuilding } from '@tabler/icons-react';

const mockEmployers = [
  { id: 1, companyName: 'บริษัท ซอฟต์แวร์โซลูชั่น จำกัด', contact: 'คุณวิชัย', email: 'contact@software.com', phone: '02-123-4567', type: 'IT/Software', jobCount: 5, status: 'active' },
  { id: 2, companyName: 'บริษัท ดีไซน์สตูดิโอ จำกัด', contact: 'คุณปิยะ', email: 'info@designstudio.com', phone: '02-234-5678', type: 'Design/Creative', jobCount: 3, status: 'active' },
  { id: 3, companyName: 'ร้าน ABC Mart', contact: 'คุณสมศรี', email: 'abc@mart.com', phone: '045-345-6789', type: 'ค้าปลีก', jobCount: 2, status: 'active' },
  { id: 4, companyName: 'บริษัท มาร์เก็ตติ้ง จำกัด', contact: 'คุณนิภา', email: 'hr@marketing.com', phone: '02-456-7890', type: 'Marketing', jobCount: 4, status: 'active' },
  { id: 5, companyName: 'สำนักงานบัญชี ABC', contact: 'คุณประเสริฐ', email: 'acc@abc.com', phone: '045-567-8901', type: 'บัญชี/การเงิน', jobCount: 1, status: 'inactive' },
  { id: 6, companyName: 'โรงแรมริมน้ำ', contact: 'คุณสุดา', email: 'info@rimnam.com', phone: '045-678-9012', type: 'Hospitality', jobCount: 6, status: 'active' },
];

export default function DataEmployers() {
  const [search, setSearch] = useState('');
  const filtered = mockEmployers.filter(e =>
    e.companyName.includes(search) || e.contact.includes(search) || e.email.includes(search)
  );

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>จัดการข้อมูลสถานประกอบการ</h1>
      <p style={{ margin: '0 0 24px', color: '#919eab', fontSize: '0.88rem' }}>จัดการข้อมูลสถานประกอบการในระบบทั้งหมด</p>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <IconSearch size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#919eab' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาชื่อบริษัท, ผู้ติดต่อ..."
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16, marginBottom: 24 }}>
        {filtered.map(emp => (
          <div key={emp.id} style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9', transition: 'transform 0.2s, box-shadow 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                <IconBuilding size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#212b36', fontSize: '1rem' }}>{emp.companyName}</div>
                <div style={{ fontSize: '0.78rem', color: '#919eab' }}>{emp.type}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 20, background: emp.status === 'active' ? '#dcfce7' : '#fee2e2', color: emp.status === 'active' ? '#16a34a' : '#dc2626', fontSize: '0.72rem', fontWeight: 700 }}>
                {emp.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.82rem', color: '#637381', marginBottom: 16 }}>
              <div>📱 {emp.phone}</div>
              <div>✉️ {emp.email}</div>
              <div>👤 {emp.contact}</div>
              <div>💼 ตำแหน่งงาน: {emp.jobCount}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e0e0e0', background: 'white', cursor: 'pointer', fontSize: '0.82rem', color: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><IconEye size={14} /> ดูข้อมูล</button>
              <button style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #e0e0e0', background: 'white', cursor: 'pointer', fontSize: '0.82rem', color: '#ed6c02', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><IconEdit size={14} /> แก้ไข</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
