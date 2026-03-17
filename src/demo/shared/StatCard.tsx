import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color = '#3b82f6', subtitle }: StatCardProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
      border: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
