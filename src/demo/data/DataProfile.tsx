import { useState } from 'react';
import { IconCamera, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';

export default function DataProfile() {
  const [profile] = useState({
    name: 'Admin Demo',
    email: 'admin@demo.com',
    phone: '081-234-5678',
    role: 'ผู้ดูแลระบบ',
    department: 'สาขาเทคโนโลยีสารสนเทศ',
    university: 'มหาวิทยาลัยราชภัฏมหาสารคาม',
    address: 'ถ.นครสวรรค์ ต.ตลาด อ.เมือง จ.มหาสารคาม 44000',
    joinDate: '01/01/2568',
    lastLogin: '12/03/2569 08:30',
  });

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>โปรไฟล์ของฉัน</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Left: Profile Card */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '40px 24px', textAlign: 'center', position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              border: '4px solid white',
              background: 'linear-gradient(135deg, #1e1e2d, #2d2d4e)',
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 900,
              margin: '0 auto 12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>A</div>
            <button style={{
              position: 'absolute', bottom: 65, left: '50%', transform: 'translateX(12px)',
              width: 32, height: 32, borderRadius: '50%',
              background: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}><IconCamera size={16} color="#637381" /></button>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>{profile.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginTop: 4 }}>{profile.role}</div>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <IconMail size={18} color="#667eea" />, label: 'อีเมล', value: profile.email },
                { icon: <IconPhone size={18} color="#667eea" />, label: 'โทรศัพท์', value: profile.phone },
                { icon: <IconMapPin size={18} color="#667eea" />, label: 'ที่อยู่', value: profile.university },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#919eab', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: '0.88rem', color: '#212b36', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Profile Details */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', padding: '32px' }}>
          <h2 style={{ margin: '0 0 24px', fontWeight: 700, fontSize: '1.1rem', color: '#212b36' }}>ข้อมูลส่วนตัว</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { label: 'ชื่อ-นามสกุล', value: profile.name },
              { label: 'อีเมล', value: profile.email },
              { label: 'โทรศัพท์', value: profile.phone },
              { label: 'บทบาท', value: profile.role },
              { label: 'สาขา', value: profile.department },
              { label: 'สถาบัน', value: profile.university },
              { label: 'ที่อยู่', value: profile.address },
              { label: 'เข้าร่วมเมื่อ', value: profile.joinDate },
              { label: 'เข้าสู่ระบบล่าสุด', value: profile.lastLogin },
            ].map((field, i) => (
              <div key={i} style={{ gridColumn: field.label === 'ที่อยู่' ? 'span 2' : undefined }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#919eab', fontWeight: 600, marginBottom: 6 }}>{field.label}</label>
                <input
                  value={field.value}
                  readOnly
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8,
                    border: '1px solid #e0e0e0', fontSize: '0.88rem',
                    color: '#212b36', background: '#f8f9fa',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
            <button style={{
              padding: '10px 28px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem',
            }}>บันทึกข้อมูล</button>
            <button style={{
              padding: '10px 28px', borderRadius: 8,
              border: '1px solid #e0e0e0', background: 'white',
              color: '#637381', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem',
            }}>ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
  );
}
