import { IconBuilding, IconDoor, IconEdit, IconPlus } from '@tabler/icons-react';

const departments = [
  { id: 'D001', name: 'อายุรกรรม', head: 'นพ. สมศักดิ์ แพทย์ดี', staff: 8, patients: 45 },
  { id: 'D002', name: 'ศัลยกรรม', head: 'พญ. จิราพร ใจงาม', staff: 5, patients: 30 },
  { id: 'D003', name: 'กุมารเวชกรรม', head: 'นพ. วิชัย ฤทธิ์ดี', staff: 4, patients: 20 },
  { id: 'D004', name: 'ห้องฉุกเฉิน', head: 'นพ. ประยุทธ์ กล้าหาญ', staff: 6, patients: 15 },
];

const rooms = [
  { id: 'R001', name: 'ห้องตรวจ 1', department: 'อายุรกรรม', status: 'open', doctor: 'นพ. สมศักดิ์', queue: 5 },
  { id: 'R002', name: 'ห้องตรวจ 2', department: 'ศัลยกรรม', status: 'open', doctor: 'พญ. จิราพร', queue: 3 },
  { id: 'R003', name: 'ห้องตรวจ 3', department: 'กุมารเวชกรรม', status: 'open', doctor: 'นพ. วิชัย', queue: 2 },
  { id: 'R004', name: 'ห้องตรวจ 4', department: 'อายุรกรรม', status: 'closed', doctor: '-', queue: 0 },
  { id: 'R005', name: 'ห้องฉุกเฉิน', department: 'ห้องฉุกเฉิน', status: 'open', doctor: 'นพ. ประยุทธ์', queue: 1 },
];

const SmpDepartments = () => (
  <div style={{ fontFamily: "'Mali', 'Sarabun', sans-serif" }}>
    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 20 }}>ระบบจัดการแผนกและห้องตรวจ</h2>

    {/* Departments */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: '#333' }}>
        <IconBuilding size={20} color="#1976d2" /> จัดการแผนก
      </h3>
      <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#1976d2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
        <IconPlus size={16} /> เพิ่มแผนก
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
      {departments.map(d => (
        <div key={d.id} style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1976d2' }}>{d.name}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>หัวหน้า: {d.head}</div>
            </div>
            <button style={{ background: '#fff3e0', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}><IconEdit size={16} color="#e65100" /></button>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}>
            <span>บุคลากร: <b>{d.staff}</b> คน</span>
            <span>ผู้ป่วย: <b>{d.patients}</b> คน</span>
          </div>
        </div>
      ))}
    </div>

    {/* Rooms */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: '#333' }}>
        <IconDoor size={20} color="#ff9800" /> จัดการห้องตรวจ
      </h3>
      <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#ff9800', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
        <IconPlus size={16} /> เพิ่มห้องตรวจ
      </button>
    </div>
    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#0077b6', color: '#fff' }}>
            {['รหัส', 'ชื่อห้อง', 'แผนก', 'แพทย์ประจำ', 'คิวรอ', 'สถานะ', 'จัดการ'].map(h => (
              <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 13, fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 ? '#f9f9f9' : '#fff' }}>
              <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#1976d2' }}>{r.id}</td>
              <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500 }}>{r.name}</td>
              <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.department}</td>
              <td style={{ padding: '10px 14px', fontSize: 13 }}>{r.doctor}</td>
              <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 700, color: r.queue > 0 ? '#e65100' : '#999' }}>{r.queue}</td>
              <td style={{ padding: '10px 14px' }}>
                <span style={{
                  background: r.status === 'open' ? '#e8f5e9' : '#ffebee',
                  color: r.status === 'open' ? '#2e7d32' : '#c62828',
                  padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                }}>{r.status === 'open' ? 'เปิดให้บริการ' : 'ปิดให้บริการ'}</span>
              </td>
              <td style={{ padding: '10px 14px' }}>
                <button style={{ background: '#fff3e0', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer' }}><IconEdit size={16} color="#e65100" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SmpDepartments;
