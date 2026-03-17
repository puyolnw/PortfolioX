import { useState } from 'react';
import { IconSearch, IconEye, IconCheck, IconX, IconClock } from '@tabler/icons-react';

const mockJobs = [
  { id: 1, title: 'Web Developer (Part-time)', company: 'บริษัท ซอฟต์แวร์โซลูชั่น จำกัด', category: 'IT/Software', salary: '200-300 บาท/วัน', positions: 2, applicants: 5, status: 'approved', createdAt: '01/03/2569' },
  { id: 2, title: 'Graphic Designer', company: 'บริษัท ดีไซน์สตูดิโอ จำกัด', category: 'Design', salary: '250 บาท/วัน', positions: 1, applicants: 3, status: 'approved', createdAt: '28/02/2569' },
  { id: 3, title: 'พนักงานขาย (Part-time)', company: 'ร้าน ABC Mart', category: 'ค้าปลีก', salary: '180 บาท/วัน', positions: 3, applicants: 8, status: 'approved', createdAt: '25/02/2569' },
  { id: 4, title: 'Content Writer', company: 'บริษัท มาร์เก็ตติ้ง จำกัด', category: 'Marketing', salary: '300 บาท/วัน', positions: 1, applicants: 2, status: 'pending', createdAt: '10/03/2569' },
  { id: 5, title: 'ผู้ช่วยบัญชี', company: 'สำนักงานบัญชี ABC', category: 'บัญชี', salary: '220 บาท/วัน', positions: 1, applicants: 1, status: 'pending', createdAt: '09/03/2569' },
  { id: 6, title: 'IT Support', company: 'บริษัท เทค จำกัด', category: 'IT', salary: '280 บาท/วัน', positions: 2, applicants: 4, status: 'approved', createdAt: '20/02/2569' },
  { id: 7, title: 'พนักงานต้อนรับ', company: 'โรงแรมริมน้ำ', category: 'Hospitality', salary: '200 บาท/วัน', positions: 2, applicants: 6, status: 'rejected', createdAt: '15/02/2569' },
  { id: 8, title: 'Data Entry Operator', company: 'บริษัท ข้อมูล จำกัด', category: 'IT', salary: '250 บาท/วัน', positions: 1, applicants: 0, status: 'pending', createdAt: '11/03/2569' },
];

export default function DataJobPosts() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = mockJobs.filter(j => {
    if (filter !== 'all' && j.status !== filter) return false;
    if (search && !j.title.includes(search) && !j.company.includes(search)) return false;
    return true;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string; icon: any }> = {
      approved: { bg: '#dcfce7', color: '#16a34a', label: 'อนุมัติแล้ว', icon: <IconCheck size={12} /> },
      pending: { bg: '#fef9c3', color: '#ca8a04', label: 'รออนุมัติ', icon: <IconClock size={12} /> },
      rejected: { bg: '#fee2e2', color: '#dc2626', label: 'ปฏิเสธ', icon: <IconX size={12} /> },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, background: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 700 }}>
        {s.icon} {s.label}
      </span>
    );
  };

  const counts = { all: mockJobs.length, approved: mockJobs.filter(j => j.status === 'approved').length, pending: mockJobs.filter(j => j.status === 'pending').length, rejected: mockJobs.filter(j => j.status === 'rejected').length };

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>จัดการตำแหน่งงานในระบบ</h1>
      <p style={{ margin: '0 0 24px', color: '#919eab', fontSize: '0.88rem' }}>ตรวจสอบและอนุมัติงานที่ลงประกาศในระบบ</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'pending', label: 'รออนุมัติ' },
          { key: 'approved', label: 'อนุมัติแล้ว' },
          { key: 'rejected', label: 'ปฏิเสธ' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            padding: '8px 20px', borderRadius: 8,
            border: filter === tab.key ? 'none' : '1px solid #e0e0e0',
            background: filter === tab.key ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white',
            color: filter === tab.key ? 'white' : '#637381',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
          }}>
            {tab.label} ({counts[tab.key as keyof typeof counts]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <IconSearch size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#919eab' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาตำแหน่งงาน, บริษัท..."
          style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {['#', 'ตำแหน่งงาน', 'สถานประกอบการ', 'หมวดหมู่', 'ค่าจ้าง', 'ตำแหน่ง', 'ผู้สมัคร', 'วันที่ลง', 'สถานะ', 'จัดการ'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((j, i) => (
                <tr key={j.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '12px 16px', color: '#919eab' }}>{i + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#212b36' }}>{j.title}</td>
                  <td style={{ padding: '12px 16px' }}>{j.company}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', fontSize: '0.75rem' }}>{j.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: 600 }}>{j.salary}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{j.positions}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>{j.applicants}</td>
                  <td style={{ padding: '12px 16px', color: '#919eab' }}>{j.createdAt}</td>
                  <td style={{ padding: '12px 16px' }}>{statusBadge(j.status)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button title="ดูรายละเอียด" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', padding: 4 }}><IconEye size={16} /></button>
                      {j.status === 'pending' && <>
                        <button title="อนุมัติ" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: 4 }}><IconCheck size={16} /></button>
                        <button title="ปฏิเสธ" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 4 }}><IconX size={16} /></button>
                      </>}
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
