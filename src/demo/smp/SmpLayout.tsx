import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconHeartRateMonitor,
  IconUserPlus,
  IconUserSearch,
  IconUsers,
  IconSettings,
  IconBuilding,
  IconDoor,
  IconChartBar,
  IconHistory,
  IconStethoscope,
  IconNurse,
  IconChevronDown,
  IconChevronRight,
  IconUserCircle,
  IconLogout,
  IconMenu2,
} from '@tabler/icons-react';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  children?: { text: string; icon: React.ReactNode; path: string }[];
}

const adminMenuItems: MenuItem[] = [
  { text: 'หน้าหลัก', icon: <IconHome size={20} />, path: '/demo/smp/dashboard' },
  {
    text: 'ผู้ป่วย',
    icon: <IconHeartRateMonitor size={20} />,
    children: [
      { text: 'เพิ่มผู้ป่วย', icon: <IconUserPlus size={18} />, path: '/demo/smp/patients/add' },
      { text: 'ค้นหาผู้ป่วย', icon: <IconUserSearch size={18} />, path: '/demo/smp/patients/search' },
    ],
  },
  {
    text: 'บุคลากร',
    icon: <IconUsers size={20} />,
    children: [
      { text: 'ค้นหาบุคลากร', icon: <IconUserSearch size={18} />, path: '/demo/smp/staff' },
    ],
  },
  {
    text: 'ระบบจัดการ',
    icon: <IconSettings size={20} />,
    children: [
      { text: 'จัดการแผนก', icon: <IconBuilding size={18} />, path: '/demo/smp/departments' },
      { text: 'จัดการห้องตรวจ', icon: <IconDoor size={18} />, path: '/demo/smp/rooms' },
    ],
  },
  {
    text: 'รายงาน',
    icon: <IconChartBar size={20} />,
    children: [
      { text: 'รายงานการคัดกรอง', icon: <IconChartBar size={18} />, path: '/demo/smp/reports/screening' },
      { text: 'รายงานผู้ป่วย', icon: <IconHistory size={18} />, path: '/demo/smp/reports/patient' },
      { text: 'รายงานแพทย์', icon: <IconStethoscope size={18} />, path: '/demo/smp/reports/doctor' },
      { text: 'รายงานพยาบาล', icon: <IconNurse size={18} />, path: '/demo/smp/reports/nurse' },
    ],
  },
];

const SmpLayout = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPageName = (() => {
    for (const item of adminMenuItems) {
      if (item.path && location.pathname === item.path) return item.text;
      if (item.children) {
        for (const child of item.children) {
          if (location.pathname === child.path) return child.text;
        }
      }
    }
    return 'SM : Smart Patient';
  })();

  const isActive = (path?: string) => path ? location.pathname === path : false;
  const isChildActive = (children?: { path: string }[]) =>
    children?.some(c => location.pathname === c.path) ?? false;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Mali', 'Sarabun', sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 0,
          minWidth: sidebarOpen ? 240 : 0,
          background: '#1a1a1a',
          color: '#f9fafb',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
          onClick={() => navigate('/demo/smp/dashboard')}
        >
          <IconHeartRateMonitor size={28} color="#6b84f4" />
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>
            SM : Smart Patient
          </span>
        </div>

        {/* Menu items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {adminMenuItems.map(item => (
            <div key={item.text}>
              <div
                onClick={() => {
                  if (item.children) {
                    setOpenMenu(openMenu === item.text ? null : item.text);
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  cursor: 'pointer',
                  background: isActive(item.path) ? 'rgba(67,97,238,0.1)' : 'transparent',
                  color: isActive(item.path) ? '#48cae4' : isChildActive(item.children) ? '#6b84f4' : '#f9fafb',
                  borderLeft: openMenu === item.text ? '3px solid #6b84f4' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: 14,
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.text}</span>
                {item.children && (
                  openMenu === item.text
                    ? <IconChevronDown size={16} />
                    : <IconChevronRight size={16} />
                )}
              </div>

              {/* Sub-items */}
              {item.children && openMenu === item.text && (
                <div style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {item.children.map(child => (
                    <div
                      key={child.path}
                      onClick={() => navigate(child.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 16px 9px 44px',
                        cursor: 'pointer',
                        color: isActive(child.path) ? '#48cae4' : 'rgba(249,250,251,0.7)',
                        borderLeft: isActive(child.path) ? '3px solid #48cae4' : '3px solid transparent',
                        background: isActive(child.path) ? 'rgba(67,97,238,0.1)' : 'transparent',
                        transition: 'all 0.2s ease',
                        fontSize: 13,
                        fontWeight: isActive(child.path) ? 600 : 400,
                      }}
                    >
                      {child.icon}
                      <span>{child.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar bottom */}
        <div
          onClick={() => navigate('/demo/smp')}
          style={{
            padding: '14px 16px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            color: 'rgba(249,250,251,0.6)',
            fontSize: 13,
            transition: 'color 0.2s',
          }}
        >
          <IconLogout size={18} />
          ออกจากระบบ
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? 240 : 0, transition: 'margin 0.3s' }}>
        {/* Header */}
        <header style={{
          background: '#1a1a1a',
          color: '#fff',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              marginRight: 16,
              padding: 4,
            }}
          >
            <IconMenu2 size={22} />
          </button>
          <span style={{ flex: 1, fontSize: 16, fontWeight: 500 }}>{currentPageName}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>สวัสดี Admin</span>
            <IconUserCircle size={28} color="#6b84f4" />
          </div>
        </header>

        {/* Content */}
        <main style={{
          flex: 1,
          background: '#e6e8eb',
          padding: 24,
          overflowY: 'auto',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SmpLayout;
