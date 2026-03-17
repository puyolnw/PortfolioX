import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconLayoutDashboard, IconUser, IconUsers, IconBuildingStore,
  IconBriefcase, IconFileText, IconChartBar,
  IconBell, IconArrowLeft, IconChevronDown, IconChevronRight,
  IconClock, IconCheck, IconLogout, IconChevronLeft
} from '@tabler/icons-react';

interface DataLayoutProps { children: ReactNode; }

const adminMenuItems = [
  { type: 'header', label: 'เมนูหลัก' },
  { label: 'หน้าหลัก', icon: IconLayoutDashboard, path: '/demo/data/dashboard' },
  { label: 'โปรไฟล์ของฉัน', icon: IconUser, path: '/demo/data/profile' },
  { type: 'header', label: 'จัดการข้อมูล' },
  { label: 'จัดการข้อมูลนักศึกษา', icon: IconUsers, path: '/demo/data/students' },
  { label: 'จัดการข้อมูลสถานประกอบการ', icon: IconBuildingStore, path: '/demo/data/employers' },
  {
    label: 'จัดการตำแหน่งงานในระบบ', icon: IconBriefcase, path: '/demo/data/job-posts',
    children: [
      { label: 'งานที่รออนุมัติ', icon: IconClock, path: '/demo/data/job-posts?status=pending' },
      { label: 'งานในระบบ', icon: IconCheck, path: '/demo/data/job-posts?status=approved' },
    ]
  },
  { label: 'จัดการข้อมูลการสมัคร', icon: IconFileText, path: '/demo/data/applications' },
  { label: 'ข้อมูลการประเมินนักศึกษา', icon: IconChartBar, path: '/demo/data/evaluations' },
];

export default function DataLayout({ children }: DataLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    const currentFull = location.pathname + location.search;
    return currentFull === path || location.pathname === path;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Sarabun', sans-serif" }}>
      {/* ===== SIDEBAR — LIGHT THEME matching original ===== */}
      <aside style={{
        width: sidebarOpen ? 320 : 80,
        minHeight: '100vh',
        background: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0, left: 0, zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* User Profile Card — glassmorphic style */}
        {sidebarOpen && (
          <div style={{
            padding: '20px',
            margin: '12px',
            borderRadius: 8,
            backgroundColor: 'rgba(93, 135, 255, 0.08)',
            border: '1px solid rgba(93, 135, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: '#5d87ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '1.2rem',
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}>A</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Name box */}
                <div style={{
                  backgroundColor: 'rgba(42, 53, 71, 0.1)',
                  borderRadius: 4,
                  padding: '6px 12px',
                  marginBottom: 8,
                  border: '1px solid rgba(42, 53, 71, 0.15)',
                }}>
                  <div style={{
                    fontSize: '0.875rem', fontWeight: 600, color: '#2A3547',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>Admin Demo</div>
                </div>
                {/* Role badge */}
                <div style={{
                  backgroundColor: 'rgba(42, 53, 71, 0.08)',
                  borderRadius: 4,
                  padding: '4px 12px',
                  border: '1px solid rgba(42, 53, 71, 0.12)',
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px', borderRadius: 12,
                    background: '#fdeded', color: '#d32f2f',
                    fontSize: '0.75rem', fontWeight: 500,
                  }}>ผู้ดูแลระบบ</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed avatar */}
        {!sidebarOpen && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#5d87ff', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.9rem',
              border: '2px solid rgba(93, 135, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>A</div>
          </div>
        )}

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: sidebarOpen ? '0 12px' : '0 4px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {adminMenuItems.map((item, i) => {
              if (item.type === 'header') {
                if (!sidebarOpen) return null;
                return (
                  <li key={i} style={{
                    padding: '24px 12px 0',
                    fontSize: '0.75rem', fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#2A3547',
                    lineHeight: '26px',
                  }}>{item.label}</li>
                );
              }

              const Icon = item.icon!;
              const active = isActive(item.path!);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenu === item.label;

              const menuItemStyle: React.CSSProperties = {
                display: 'flex', alignItems: 'center', gap: 8,
                padding: sidebarOpen ? '12px 16px' : '12px 8px',
                borderRadius: 12,
                cursor: 'pointer',
                marginBottom: 4,
                marginLeft: sidebarOpen ? 16 : 8,
                marginRight: sidebarOpen ? 16 : 8,
                background: active ? '#5d87ff' : 'rgba(255, 255, 255, 0.6)',
                color: active ? 'white' : '#2A3547',
                border: active ? '1px solid #5d87ff' : '1px solid rgba(93, 135, 255, 0.1)',
                boxShadow: active ? '0 4px 12px rgba(93, 135, 255, 0.3)' : 'none',
                fontWeight: active ? 600 : 500,
                fontSize: '0.88rem',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              };

              return (
                <li key={i}>
                  <div
                    onClick={() => {
                      if (hasChildren) {
                        setExpandedMenu(isExpanded ? null : item.label!);
                      } else {
                        navigate(item.path!);
                      }
                    }}
                    style={menuItemStyle}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <span style={{ minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: '3px 0' }}>
                      <Icon size={20} stroke={1.5} />
                    </span>
                    {sidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
                    {sidebarOpen && hasChildren && (isExpanded ?
                      <IconChevronDown size={16} /> : <IconChevronRight size={16} />)}
                  </div>
                  {hasChildren && isExpanded && sidebarOpen && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {item.children!.map((child, ci) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.path);
                        return (
                          <li key={ci}>
                            <div
                              onClick={() => navigate(child.path)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '12px 16px 12px 48px',
                                borderRadius: 12,
                                cursor: 'pointer',
                                marginLeft: 16, marginRight: 16, marginBottom: 4,
                                background: childActive ? '#5d87ff' : 'transparent',
                                color: childActive ? 'white' : '#2A3547',
                                fontSize: '0.85rem',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <ChildIcon size={18} stroke={1.5} /> {child.label}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button — blue bg matching original */}
        <div style={{
          padding: 16,
          borderTop: '1px solid #e5eaef',
          background: 'rgb(226, 236, 252)',
        }}>
          <button onClick={() => navigate('/demo/data')} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 16px', borderRadius: 8,
            border: '1px solid #d32f2f', background: 'transparent',
            color: '#d32f2f', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500,
            transition: 'all 0.2s',
          }}>
            <IconLogout size={18} />
            {sidebarOpen && 'ออกจากระบบ'}
          </button>
        </div>

        {/* Toggle Button — bottom matching original */}
        <div style={{
          padding: 8,
          display: 'flex', justifyContent: 'center',
          borderTop: '1px solid #e5eaef',
          backgroundColor: 'rgba(248, 249, 250, 0.8)',
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'พับไซบาร์' : 'ขยายไซบาร์'}
            style={{
              width: 40, height: 40, borderRadius: 8,
              background: 'rgba(93, 135, 255, 0.1)',
              border: '1px solid rgba(93, 135, 255, 0.2)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {sidebarOpen ? <IconChevronLeft size={18} color="#5d87ff" /> : <IconChevronRight size={18} color="#5d87ff" />}
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{
        flex: 1, marginLeft: sidebarOpen ? 320 : 80,
        transition: 'margin-left 0.3s ease',
        background: '#f8f9fa', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header — Blue AppBar matching original rgb(169,198,247) */}
        <header style={{
          height: 70,
          background: 'rgb(169, 198, 247)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e9ecef',
          display: 'flex', alignItems: 'center',
          padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{ flex: 1 }} />

          {/* Notification Bell */}
          <div style={{ position: 'relative', cursor: 'pointer', marginRight: 16 }}>
            <IconBell size={22} color="#2A3547" />
            <span style={{
              position: 'absolute', top: -4, right: -4,
              width: 16, height: 16, borderRadius: '50%',
              background: '#ef4444', color: 'white',
              fontSize: '0.6rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>3</span>
          </div>

          {/* Profile Avatar with dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{
                width: 35, height: 35, borderRadius: '50%',
                background: '#5d87ff', color: 'white',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.85rem',
              }}
            >A</button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div style={{
                position: 'absolute', top: 45, right: 0,
                width: 240, background: 'white',
                borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 100, overflow: 'hidden',
              }}>
                <div style={{ padding: '8px 16px' }}>
                  <button onClick={() => { navigate('/demo/data/profile'); setProfileMenuOpen(false); }} style={{
                    width: '100%', padding: '10px 16px', borderRadius: 8,
                    background: '#5d87ff', color: 'white', border: 'none',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}><IconUser size={20} /> โปรไฟล์ของฉัน</button>
                </div>
                <div style={{ borderTop: '1px solid #e0e0e0', padding: '8px 16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2A3547' }}>Admin Demo</div>
                  <div style={{ fontSize: '0.75rem', color: '#919eab' }}>ผู้ดูแลระบบ</div>
                </div>
                <div style={{ borderTop: '1px solid #e0e0e0', padding: '8px 16px' }}>
                  <button onClick={() => { navigate('/demo/data'); setProfileMenuOpen(false); }} style={{
                    width: '100%', padding: '10px 16px', borderRadius: 8,
                    background: 'transparent', border: '1px solid #d32f2f',
                    color: '#d32f2f', cursor: 'pointer', fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}><IconLogout size={18} /> ออกจากระบบ</button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '20px', maxWidth: 1200, width: '100%', margin: '0 auto', flex: 1, background: 'transparent' }}>
          <div style={{ minHeight: 'calc(100vh - 170px)' }}>
            {children}
          </div>
        </main>

        {/* Footer — matching original */}
        <footer style={{
          padding: '48px 0 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.88rem', color: '#637381', fontWeight: 500, marginBottom: 4 }}>
            © ลิขสิทธิ์ นายธนวัฒน์ พลนางเครือ
          </div>
          <div style={{ fontSize: '0.88rem', color: '#637381', fontWeight: 500 }}>
            นักศึกษา มหาวิทยาลัยราชภัฏมหาสารคาม คณะเทคโนโลยีสารสนเทศ สาขาเทคโนโลยีสารสนเทศ
          </div>
        </footer>
      </div>

      {/* Back to Portfolio floating button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', bottom: 20, right: 20,
          padding: '10px 20px', borderRadius: 12,
          background: '#5d87ff', color: 'white',
          border: 'none', cursor: 'pointer',
          fontSize: '0.82rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 4px 16px rgba(93,135,255,0.3)',
          zIndex: 100,
          transition: 'transform 0.2s',
        }}
      >
        <IconArrowLeft size={16} /> กลับหน้าหลัก
      </button>
    </div>
  );
}
