import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MockLoginPageProps {
  projectName: string;
  projectColor: string;
  redirectTo: string;
  description?: string;
}

export default function MockLoginPage({ projectName, projectColor, redirectTo, description }: MockLoginPageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => navigate(redirectTo), 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        padding: '3rem',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: projectColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '1.5rem',
          fontWeight: 900
        }}>
          {projectName.charAt(0)}
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{projectName}</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.5, marginBottom: '2rem' }}>
          {description || 'Demo Version — Auto Login'}
        </p>

        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: 6 }}>Email</label>
          <input
            value="admin@demo.com"
            readOnly
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '0.95rem',
              marginBottom: '1rem',
              boxSizing: 'border-box'
            }}
          />
          <label style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: 6 }}>Password</label>
          <input
            value="••••••••"
            readOnly
            type="password"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '0.95rem',
              marginBottom: '2rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: 'none',
            background: loading ? `${projectColor}80` : projectColor,
            color: 'white',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: `0 8px 24px ${projectColor}40`,
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Logging in...' : 'Login as Admin (Demo)'}
        </button>

        <p style={{ fontSize: '0.75rem', opacity: 0.3, marginTop: '1.5rem' }}>
          This is a demo version. No real authentication required.
        </p>
      </div>
    </div>
  );
}
