import { IconChartBar, IconUsers, IconCheck } from '@tabler/icons-react';

const screeningStats = [
  { label: 'คัดกรองทั้งหมด', value: 156, color: '#1976d2' },
  { label: 'ผ่านปกติ', value: 98, color: '#4caf50' },
  { label: 'เสี่ยง', value: 42, color: '#ff9800' },
  { label: 'วิกฤต', value: 16, color: '#e53e3e' },
];

const monthlyData = [
  { month: 'ม.ค.', total: 120, normal: 80, risk: 30, critical: 10 },
  { month: 'ก.พ.', total: 135, normal: 85, risk: 35, critical: 15 },
  { month: 'มี.ค.', total: 156, normal: 98, risk: 42, critical: 16 },
];

const topDoctors = [
  { name: 'นพ. สมศักดิ์ แพทย์ดี', patients: 45, dept: 'อายุรกรรม' },
  { name: 'พญ. จิราพร ใจงาม', patients: 38, dept: 'ศัลยกรรม' },
  { name: 'นพ. วิชัย ฤทธิ์ดี', patients: 25, dept: 'กุมารเวชกรรม' },
];

const topNurses = [
  { name: 'พว. นิตยา ใจดี', screenings: 52, dept: 'อายุรกรรม' },
  { name: 'พว. สุกัญญา แสงเดือน', screenings: 48, dept: 'ห้องฉุกเฉิน' },
];

const SmpReports = () => (
  <div style={{ fontFamily: "'Mali', 'Sarabun', sans-serif" }}>
    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#333', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconChartBar size={24} color="#1976d2" /> ระบบรายงาน
    </h2>

    {/* Stats Summary */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {screeningStats.map(s => (
        <div key={s.label} style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          borderLeft: `4px solid ${s.color}`,
        }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Monthly Chart (simplified) */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 16 }}>รายงานรายเดือน</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
              {['เดือน', 'ทั้งหมด', 'ปกติ', 'เสี่ยง', 'วิกฤต'].map(h => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyData.map(m => (
              <tr key={m.month} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>{m.month}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>{m.total}</span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>{m.normal}</span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{ background: '#fff3e0', color: '#e65100', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>{m.risk}</span>
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <span style={{ background: '#ffebee', color: '#c62828', padding: '2px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>{m.critical}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bar visual */}
        <div style={{ marginTop: 16 }}>
          {monthlyData.map(m => (
            <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 40, fontSize: 12, fontWeight: 600, color: '#666' }}>{m.month}</span>
              <div style={{ flex: 1, height: 18, background: '#f0f0f0', borderRadius: 9, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${(m.normal / m.total) * 100}%`, background: '#4caf50', height: '100%' }} />
                <div style={{ width: `${(m.risk / m.total) * 100}%`, background: '#ff9800', height: '100%' }} />
                <div style={{ width: `${(m.critical / m.total) * 100}%`, background: '#e53e3e', height: '100%' }} />
              </div>
              <span style={{ fontSize: 12, color: '#999', minWidth: 30 }}>{m.total}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#666' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#4caf50', display: 'inline-block' }} /> ปกติ</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#666' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#ff9800', display: 'inline-block' }} /> เสี่ยง</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#666' }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#e53e3e', display: 'inline-block' }} /> วิกฤต</span>
          </div>
        </div>
      </div>

      {/* Doctors & Nurses */}
      <div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconUsers size={18} color="#1976d2" /> ผลงานแพทย์
          </h3>
          {topDoctors.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topDoctors.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e3f2fd', color: '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{d.dept}</div>
              </div>
              <span style={{ fontWeight: 700, color: '#1976d2', fontSize: 18 }}>{d.patients}</span>
              <span style={{ fontSize: 12, color: '#999' }}>ราย</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconCheck size={18} color="#4caf50" /> ผลงานพยาบาล
          </h3>
          {topNurses.map((n, i) => (
            <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topNurses.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{n.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{n.dept}</div>
              </div>
              <span style={{ fontWeight: 700, color: '#4caf50', fontSize: 18 }}>{n.screenings}</span>
              <span style={{ fontSize: 12, color: '#999' }}>ครั้ง</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SmpReports;
