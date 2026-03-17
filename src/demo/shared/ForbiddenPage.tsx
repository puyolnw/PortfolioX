import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        fontSize: '8rem',
        fontWeight: 900,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        403
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Access Restricted
      </h1>
      <p style={{ fontSize: '1.1rem', opacity: 0.6, maxWidth: 500, marginBottom: '2.5rem' }}>
        หน้านี้ไม่พร้อมใช้งานในเวอร์ชัน Demo หรือคุณไม่มีสิทธิ์เข้าถึง
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 32px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 32px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 8px 24px rgba(239,68,68,0.3)'
          }}
        >
          Back to Portfolio
        </button>
      </div>
    </div>
  );
}
