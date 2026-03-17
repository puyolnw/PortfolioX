import { useState } from 'react';
import { IconSearch, IconUserPlus, IconEdit, IconEye } from '@tabler/icons-react';

const mockPatients = [
  { id: 'P001', prefix: 'นาย', name: 'สมชาย ใจดี', age: 72, gender: 'ชาย', phone: '081-234-5678', blood: 'O', diseases: ['เบาหวาน', 'ความดัน'] },
  { id: 'P002', prefix: 'นางสาว', name: 'สายใจ สุขใจ', age: 65, gender: 'หญิง', phone: '089-876-5432', blood: 'A', diseases: ['หัวใจ'] },
  { id: 'P003', prefix: 'นาง', name: 'วิลาวัณย์ มั่นคง', age: 68, gender: 'หญิง', phone: '085-111-2233', blood: 'B', diseases: ['ความดัน', 'หัวใจ', 'เบาหวาน'] },
  { id: 'P004', prefix: 'นาย', name: 'ประเสริฐ แก้วมณี', age: 75, gender: 'ชาย', phone: '087-654-3210', blood: 'AB', diseases: [] },
  { id: 'P005', prefix: 'นาง', name: 'สมศรี ทองดี', age: 70, gender: 'หญิง', phone: '086-999-8888', blood: 'O', diseases: ['เบาหวาน'] },
  { id: 'P006', prefix: 'นาย', name: 'สุพจน์ รุ่งเรือง', age: 62, gender: 'ชาย', phone: '082-333-4444', blood: 'A', diseases: ['ต้อกระจก'] },
];

const SmpPatients = () => {
  const [search, setSearch] = useState('');
  const filtered = mockPatients.filter(p =>
    p.name.includes(search) || p.id.includes(search) || p.phone.includes(search)
  );

  return (
    <div style={{ fontFamily: "'Mali', 'Sarabun', sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 20 }}>
        จัดการข้อมูลผู้ป่วย
      </h2>

      {/* Search & Add */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderRadius: 10,
          padding: '0 14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <IconSearch size={18} color="#999" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, รหัส, หรือเบอร์โทร..."
            style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 10px', fontSize: 14, fontFamily: 'inherit', background: 'transparent' }}
          />
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#1976d2', color: '#fff', border: 'none',
          padding: '10px 20px', borderRadius: 10, cursor: 'pointer',
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
        }}>
          <IconUserPlus size={18} /> เพิ่มผู้ป่วย
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0077b6', color: '#fff' }}>
              {['รหัส', 'คำนำหน้า', 'ชื่อ-นามสกุล', 'อายุ', 'เพศ', 'เบอร์โทร', 'กรุ๊ปเลือด', 'โรคประจำตัว', 'จัดการ'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 13, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#1976d2' }}>{p.id}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{p.prefix}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{p.age}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{p.gender}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{p.phone}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>
                  <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>{p.blood}</span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 12 }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {p.diseases.length > 0 ? p.diseases.map(d => (
                      <span key={d} style={{ border: '1px solid #1976d2', color: '#1976d2', padding: '1px 8px', borderRadius: 10, fontSize: 11 }}>{d}</span>
                    )) : <span style={{ color: '#999' }}>-</span>}
                  </div>
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

      <div style={{ textAlign: 'center', padding: 16, color: '#999', fontSize: 13 }}>
        แสดง {filtered.length} จาก {mockPatients.length} รายการ
      </div>
    </div>
  );
};

export default SmpPatients;
