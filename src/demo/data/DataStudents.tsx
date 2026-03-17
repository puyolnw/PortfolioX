import { useState } from 'react';
import { IconSearch, IconFilter, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

const mockStudents = [
  { id: 1, studentId: '6501001', name: 'สมชาย ใจดี', email: 'somchai@email.com', faculty: 'เทคโนโลยีสารสนเทศ', year: 4, phone: '081-234-5678', status: 'active', gpa: 3.45 },
  { id: 2, studentId: '6501002', name: 'สมหญิง รักเรียน', email: 'somying@email.com', faculty: 'บริหารธุรกิจ', year: 3, phone: '089-876-5432', status: 'active', gpa: 3.80 },
  { id: 3, studentId: '6501003', name: 'วิชัย แก้วมณี', email: 'wichai@email.com', faculty: 'วิทยาศาสตร์', year: 4, phone: '062-345-6789', status: 'active', gpa: 2.95 },
  { id: 4, studentId: '6501004', name: 'นริศรา พลอยสวย', email: 'narisara@email.com', faculty: 'เทคโนโลยีสารสนเทศ', year: 3, phone: '095-111-2222', status: 'inactive', gpa: 3.60 },
  { id: 5, studentId: '6501005', name: 'กานต์ สายลม', email: 'karn@email.com', faculty: 'ศิลปศาสตร์', year: 2, phone: '088-333-4444', status: 'active', gpa: 3.15 },
  { id: 6, studentId: '6501006', name: 'ปิยะ ดวงดาว', email: 'piya@email.com', faculty: 'วิศวกรรมศาสตร์', year: 4, phone: '081-555-6666', status: 'active', gpa: 3.72 },
  { id: 7, studentId: '6501007', name: 'ธนพล สุขสวัสดิ์', email: 'thanapol@email.com', faculty: 'เทคโนโลยีสารสนเทศ', year: 3, phone: '092-777-8888', status: 'active', gpa: 3.30 },
  { id: 8, studentId: '6501008', name: 'มนัสนันท์ เพชรงาม', email: 'manus@email.com', faculty: 'บริหารธุรกิจ', year: 2, phone: '063-999-0000', status: 'active', gpa: 3.55 },
];

export default function DataStudents() {
  const [search, setSearch] = useState('');
  const filtered = mockStudents.filter(s =>
    s.name.includes(search) || s.studentId.includes(search) || s.email.includes(search)
  );

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>จัดการข้อมูลนักศึกษา</h1>
      <p style={{ margin: '0 0 24px', color: '#919eab', fontSize: '0.88rem' }}>จัดการข้อมูลนักศึกษาในระบบทั้งหมด</p>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <IconSearch size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#919eab' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, รหัสนักศึกษา, อีเมล..."
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, border: '1px solid #e0e0e0', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#637381' }}>
          <IconFilter size={16} /> ตัวกรอง
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, color: '#637381', fontSize: '0.88rem' }}>นักศึกษาทั้งหมด {filtered.length} คน</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {['#', 'รหัส', 'ชื่อ-นามสกุล', 'อีเมล', 'คณะ', 'ชั้นปี', 'GPA', 'สถานะ', 'จัดการ'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f8f9fa', transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 16px', color: '#919eab' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.studentId}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>{s.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#212b36' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#919eab' }}>{s.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#637381' }}>{s.email}</td>
                  <td style={{ padding: '12px 16px' }}>{s.faculty}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>ปี {s.year}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: s.gpa >= 3.5 ? '#16a34a' : s.gpa >= 3.0 ? '#2563eb' : '#d97706' }}>{s.gpa.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, background: s.status === 'active' ? '#dcfce7' : '#fee2e2', color: s.status === 'active' ? '#16a34a' : '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>
                      {s.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button title="ดูข้อมูล" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', padding: 4 }}><IconEye size={16} /></button>
                      <button title="แก้ไข" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ed6c02', padding: 4 }}><IconEdit size={16} /></button>
                      <button title="ลบ" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', padding: 4 }}><IconTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
