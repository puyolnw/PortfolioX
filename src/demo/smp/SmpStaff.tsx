import { IconSearch, IconEdit, IconEye } from '@tabler/icons-react';
import { useState } from 'react';

const mockStaff = [
  { id: 'E001', name: 'นพ. สมศักดิ์ แพทย์ดี', role: 'doctor', department: 'อายุรกรรม', phone: '081-111-2222', status: 'active' },
  { id: 'E002', name: 'พญ. จิราพร ใจงาม', role: 'doctor', department: 'ศัลยกรรม', phone: '082-333-4444', status: 'active' },
  { id: 'E003', name: 'พว. นิตยา ใจดี', role: 'nurse', department: 'อายุรกรรม', phone: '083-555-6666', status: 'active' },
  { id: 'E004', name: 'พว. สุกัญญา แสงเดือน', role: 'nurse', department: 'ห้องฉุกเฉิน', phone: '084-777-8888', status: 'active' },
  { id: 'E005', name: 'นาง มาลี ทองสุข', role: 'admin', department: 'ธุรการ', phone: '085-999-0000', status: 'active' },
  { id: 'E006', name: 'นพ. วิชัย ฤทธิ์ดี', role: 'doctor', department: 'กุมารเวชกรรม', phone: '086-222-3333', status: 'inactive' },
];

const roleLabels: Record<string, { label: string; bg: string; color: string }> = {
  doctor: { label: 'แพทย์', bg: '#e3f2fd', color: '#1565c0' },
  nurse: { label: 'พยาบาล', bg: '#e8f5e9', color: '#2e7d32' },
  admin: { label: 'ผู้ดูแลระบบ', bg: '#fce4ec', color: '#c62828' },
};

const SmpStaff = () => {
  const [search, setSearch] = useState('');
  const filtered = mockStaff.filter(s => s.name.includes(search) || s.id.includes(search));

  return (
    <div style={{ fontFamily: "'Mali', 'Sarabun', sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 20 }}>จัดการข้อมูลบุคลากร</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 10, padding: '0 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <IconSearch size={18} color="#999" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาชื่อหรือรหัสบุคลากร..." style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 10px', fontSize: 14, fontFamily: 'inherit', background: 'transparent' }} />
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0077b6', color: '#fff' }}>
              {['รหัส', 'ชื่อ-นามสกุล', 'ตำแหน่ง', 'แผนก', 'เบอร์โทร', 'สถานะ', 'จัดการ'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 13, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#1976d2' }}>{s.id}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: roleLabels[s.role].bg, color: roleLabels[s.role].color, padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                    {roleLabels[s.role].label}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{s.department}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{s.phone}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    background: s.status === 'active' ? '#e8f5e9' : '#ffebee',
                    color: s.status === 'active' ? '#2e7d32' : '#c62828',
                    padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  }}>{s.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ background: '#e3f2fd', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}><IconEye size={16} color="#1976d2" /></button>
                    <button style={{ background: '#fff3e0', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}><IconEdit size={16} color="#e65100" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmpStaff;
