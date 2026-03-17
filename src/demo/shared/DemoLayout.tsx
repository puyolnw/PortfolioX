import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { IconMenu2, IconX, IconArrowLeft } from '@tabler/icons-react';

interface MenuItem {
  label: string;
  path: string;
  icon?: ReactNode;
}

interface DemoLayoutProps {
  children: ReactNode;
  projectName: string;
  projectColor: string;
  menuItems: MenuItem[];
}

export default function DemoLayout({ children, projectName, projectColor, menuItems }: DemoLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 260 : 0,
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 40,
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: projectColor, whiteSpace: 'nowrap' }}>
            {projectName}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: 4 }}>Demo Version</div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  background: isActive ? projectColor : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <IconArrowLeft size={16} /> Back to Portfolio
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 260 : 0, transition: 'margin-left 0.3s ease', background: '#f8fafc' }}>
        {/* Top bar */}
        <header style={{
          height: 64,
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            {sidebarOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
          <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{projectName}</span>
          <span style={{
            marginLeft: 8,
            padding: '2px 10px',
            borderRadius: 6,
            background: `${projectColor}20`,
            color: projectColor,
            fontSize: '0.75rem',
            fontWeight: 700
          }}>DEMO</span>
          <div style={{ flex: 1 }} />
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: projectColor,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}>A</div>
        </header>

        {/* Content */}
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
