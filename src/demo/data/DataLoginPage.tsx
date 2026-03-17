import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => navigate('/demo/data/dashboard'), 900);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', 'Sarabun', sans-serif",
    }}>
      {/* Left: Branding — matching original #1A237E → #0D47A1 gradient */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative shapes — matching original */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(33,203,243,0.1)', filter: 'blur(40px)' }} />

        <div style={{ zIndex: 1, textAlign: 'center', maxWidth: 480 }}>
          <h1 style={{
            fontSize: '3rem', fontWeight: 800, marginBottom: '0.75rem',
            lineHeight: 1.2, letterSpacing: '-2px',
          }}>
            Find Your Path to{' '}
            <span style={{
              background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Success</span>
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.6, fontWeight: 300 }}>
            ระบบจัดการสหกิจศึกษาและหางานที่เชื่อมโยงนักศึกษากับโอกาสระดับสากล
            พร้อมเครื่องมือจัดการที่ครบวงจรที่สุด
          </p>

          {/* Glassmorphic search bar preview — matching original */}
          <div style={{
            marginTop: '2.5rem',
            padding: '12px',
            borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex', gap: 12,
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          }}>
            <input
              placeholder="ค้นหาตำแหน่งงาน, ชื่อบริษัท..."
              readOnly
              style={{
                flex: 1, padding: '14px 16px',
                background: 'transparent', border: 'none',
                color: 'white', fontSize: '1.1rem',
                outline: 'none',
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                padding: '14px 32px', borderRadius: 16,
                background: '#21CBF3', color: 'white',
                border: 'none', cursor: 'pointer',
                fontWeight: 800, fontSize: '1.05rem',
                boxShadow: '0 8px 16px rgba(33, 203, 243, 0.3)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >ค้นหางาน</button>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['React', 'Node.js', 'MongoDB', 'Express', 'MUI'].map(tech => (
              <span key={tech} style={{
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontSize: '0.78rem', fontWeight: 600,
              }}>{tech}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div style={{
        width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fbfcfd', padding: '3rem',
      }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2A3547', marginBottom: '0.5rem' }}>
            เข้าสู่ระบบ
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#919eab', marginBottom: '2rem' }}>
            Demo Version — กรอกอะไรก็ได้เพื่อเข้าสู่ระบบ
          </p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#637381', fontWeight: 600, marginBottom: 6 }}>อีเมล</label>
            <input
              defaultValue="admin@demo.com"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                border: '1px solid #e0e0e0', fontSize: '0.92rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: '#637381', fontWeight: 600, marginBottom: 6 }}>รหัสผ่าน</label>
            <input
              type="password"
              defaultValue="demo1234"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                border: '1px solid #e0e0e0', fontSize: '0.92rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 10,
              border: 'none', cursor: loading ? 'wait' : 'pointer',
              background: loading ? '#a5b4c8' : '#5d87ff',
              color: 'white', fontWeight: 800, fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(93,135,255,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Demo)'}
          </button>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.78rem', color: '#c4cdd5' }}>
            นี่คือระบบสาธิต — ไม่ต้องลงทะเบียน
          </div>
        </div>
      </div>
    </div>
  );
}
