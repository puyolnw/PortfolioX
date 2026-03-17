import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconHeartRateMonitor,
  IconShieldCheck,
  IconLogin,
  IconUser,
  IconLock,
} from '@tabler/icons-react';

const SmpLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/demo/smp/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Mali', 'Sarabun', sans-serif" }}>
      {/* Header */}
      <header style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, fontSize: 18 }}>
          <IconHeartRateMonitor size={28} color="#6b84f4" />
          SM : Smart Patient
        </div>
        <button
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            fontFamily: 'inherit',
          }}
        >
          <IconShieldCheck size={18} />
          การแสดงผล
        </button>
      </header>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f9fafb',
        padding: 20,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6b84f4, #48cae4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <IconHeartRateMonitor size={32} color="#fff" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#6b84f4', margin: '0 0 4px' }}>
              เข้าสู่ระบบ
            </h2>
            <p style={{ color: '#999', fontSize: 14, margin: 0 }}>
              Demo Version — กรอกอะไรก็ได้เพื่อเข้าสู่ระบบ
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                ชื่อผู้ใช้
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 10,
                padding: '0 12px',
                transition: 'border-color 0.3s',
              }}>
                <IconUser size={18} color="#999" />
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '12px 10px',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    background: 'transparent',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                รหัสผ่าน
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 10,
                padding: '0 12px',
              }}>
                <IconLock size={18} color="#999" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="password"
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    padding: '12px 10px',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    background: 'transparent',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              <IconLogin size={20} />
              เข้าสู่ระบบ (Demo)
            </button>
          </form>

          <div style={{
            marginTop: 24,
            padding: '12px 16px',
            background: '#f0f4ff',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: '#6b84f4',
          }}>
            <IconShieldCheck size={18} />
            ดีโมระบบ — ไม่ต้องลงทะเบียน
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: 'rgba(255,255,255,0.6)',
        padding: '12px 0',
        textAlign: 'center',
        fontSize: 13,
      }}>
        © 2024 Smart Patient System. All rights reserved.
      </footer>
    </div>
  );
};

export default SmpLoginPage;
