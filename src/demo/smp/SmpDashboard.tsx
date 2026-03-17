import {
  IconUrgent,
  IconClock,
  IconCheck,
  IconUsers,
  IconUserPlus,
  IconShieldCheck,
  IconClipboard,
  IconCalendarEvent,
  IconDoor,
  IconRefresh,
  IconChevronRight,
  IconArrowRight,
  IconHeartRateMonitor,
} from '@tabler/icons-react';

const stats = [
  { label: 'วิกฤต', value: 2, icon: <IconUrgent size={32} />, bg: '#ef5350', color: '#fff' },
  { label: 'รอคัดกรอง', value: 5, icon: <IconClock size={32} />, bg: '#ff9800', color: '#fff' },
  { label: 'คัดกรองแล้ว', value: 10, icon: <IconCheck size={32} />, bg: '#4caf50', color: '#fff' },
  { label: 'คิวรอรักษา', value: 7, icon: <IconUsers size={32} />, bg: '#2196f3', color: '#fff' },
];

const quickActions = [
  { title: 'เพิ่มผู้ป่วยใหม่', desc: 'ลงทะเบียนผู้ป่วยใหม่เข้าสู่ระบบ', icon: <IconUserPlus size={30} />, color: '#1976d2' },
  { title: 'ยืนยันตัวตนผู้ป่วย', desc: 'ยืนยันตัวตนเพื่อเข้าสู่กระบวนการคัดกรอง', icon: <IconShieldCheck size={30} />, color: '#9c27b0' },
  { title: 'คัดกรองผู้ป่วย', desc: 'บันทึกข้อมูลสัญญาณชีพและอาการเบื้องต้น', icon: <IconClipboard size={30} />, color: '#4caf50' },
  { title: 'จัดการคิว', desc: 'จัดการคิวผู้ป่วยตามห้องตรวจและแผนก', icon: <IconCalendarEvent size={30} />, color: '#ff9800' },
];

const recentPatients = [
  { id: 1, name: 'นาย สมชาย ใจดี', age: 35, gender: 'ชาย', phone: '081-234-5678', blood: 'O', queue: 'A001', status: 'waiting', priority: 2, diseases: ['เบาหวาน'] },
  { id: 2, name: 'นางสาว สายใจ สุขใจ', age: 28, gender: 'หญิง', phone: '089-876-5432', blood: 'A', queue: 'A002', status: 'waiting', priority: 3, diseases: [] },
  { id: 3, name: 'นาง วิลาวัณย์ มั่นคง', age: 68, gender: 'หญิง', phone: '085-111-2233', blood: 'B', queue: 'A003', status: 'in_progress', priority: 1, diseases: ['ความดัน', 'หัวใจ'] },
];

const SmpDashboard = () => {
  return (
    <div style={{ fontFamily: "'Mali', 'Sarabun', sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <IconHeartRateMonitor size={48} color="#e53e3e" />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1976d2', margin: 0 }}>
            ระบบคัดกรองและจัดคิวผู้ป่วยสูงอายุ
          </h1>
        </div>
        <p style={{ color: '#666', fontSize: 14, margin: '4px 0 0' }}>
          ระบบคัดกรองผู้ป่วยเพื่อจัดลำดับความสำคัญและจัดคิวการรักษา
        </p>
      </div>

      {/* Updated & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: '#999' }}>อัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH')}</span>
        <button style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <IconRefresh size={18} color="#1976d2" />
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: s.bg,
            color: s.color,
            borderRadius: 12,
            padding: 20,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{s.value}</div>
            <div style={{ fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Left */}
        <div>
          {/* Quick Actions */}
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#333' }}>การดำเนินการ</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {quickActions.map(a => (
              <div key={a.title} style={{
                background: '#fff',
                borderRadius: 12,
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: a.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                }}>{a.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{a.title}</div>
                <div style={{ color: '#999', fontSize: 13 }}>{a.desc}</div>
              </div>
            ))}
          </div>

          {/* Recent Patients */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#333' }}>ผู้ป่วยล่าสุด</h3>
            <button style={{ background: 'transparent', border: 'none', color: '#1976d2', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
              ดูทั้งหมด <IconArrowRight size={16} />
            </button>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {recentPatients.map((p, i) => (
              <div key={p.id} style={{
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderBottom: i < recentPatients.length - 1 ? '1px solid #f0f0f0' : 'none',
              }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#1976d2',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 600,
                }}>
                  {p.name.charAt(p.name.indexOf(' ') + 1)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>อายุ: {p.age} ปี | {p.gender} | โทร: {p.phone}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: p.status === 'waiting' ? '#fff3e0' : '#e3f2fd',
                      color: p.status === 'waiting' ? '#e65100' : '#1565c0',
                      fontWeight: 600,
                    }}>คิว: {p.queue}</span>
                    {p.priority === 1 && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#ffebee', color: '#c62828', fontWeight: 600 }}>วิกฤต</span>
                    )}
                    {p.priority === 2 && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#fff3e0', color: '#e65100', fontWeight: 600 }}>เร่งด่วน</span>
                    )}
                    {p.diseases.map(d => (
                      <span key={d} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, border: '1px solid #1976d2', color: '#1976d2' }}>{d}</span>
                    ))}
                  </div>
                </div>
                <button style={{
                  background: 'transparent',
                  border: '1px solid #1976d2',
                  color: '#1976d2',
                  padding: '6px 14px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  ดูข้อมูล <IconChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          {/* System Status */}
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#333' }}>สถานะระบบ</h3>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <IconDoor size={22} color="#1976d2" />
              <span style={{ fontWeight: 600 }}>ห้องตรวจที่เปิดให้บริการ</span>
            </div>
            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <span style={{ fontSize: 52, fontWeight: 700, color: '#1976d2' }}>3</span>
              <span style={{ fontSize: 16, color: '#999', marginLeft: 6 }}>ห้อง</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span>ผู้ป่วยที่คัดกรองผ่านแล้ว:</span>
              <span style={{ fontWeight: 700 }}>20 คน</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14 }}>
              <span>คิวที่กำลังรอ:</span>
              <span style={{ fontWeight: 700 }}>7 คิว</span>
            </div>
            <button style={{
              width: '100%',
              padding: '10px 0',
              border: '1px solid #1976d2',
              color: '#1976d2',
              background: '#fff',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}>
              ดูสถานะคิวทั้งหมด
            </button>
          </div>

          {/* Quick Links */}
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#333' }}>ลิงก์ด่วน</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'ค้นหาผู้ป่วย', color: '#1976d2' },
              { label: 'คัดแยกประเภท', color: '#e53e3e' },
              { label: 'ระบบผู้ป่วย', color: '#4caf50' },
              { label: 'จัดการห้อง', color: '#ff9800' },
            ].map(link => (
              <div key={link.label} style={{
                background: '#fff',
                borderRadius: 10,
                padding: 16,
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ color: link.color, fontWeight: 600, fontSize: 13 }}>{link.label}</div>
              </div>
            ))}
          </div>

          {/* System Info */}
          <div style={{
            background: 'linear-gradient(135deg, #42a5f5, #1976d2)',
            borderRadius: 12,
            padding: 20,
            color: '#fff',
          }}>
            <h4 style={{ margin: '0 0 8px', fontWeight: 600 }}>ข้อมูลระบบ</h4>
            <p style={{ fontSize: 13, margin: '0 0 12px', opacity: 0.9, lineHeight: 1.6 }}>
              ระบบคัดกรองและจัดคิวผู้ป่วยอัตโนมัติ ช่วยให้การบริหารจัดการผู้ป่วยมีประสิทธิภาพมากขึ้น
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span>สถานะระบบ:</span>
              <span style={{ background: '#fff', color: '#4caf50', padding: '1px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>ออนไลน์</span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
              เวอร์ชัน: 1.0.0 | อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmpDashboard;
