import StatCard from '../shared/StatCard';
import { IconUsers, IconStethoscope, IconClock, IconBuilding } from '@tabler/icons-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { name: 'ม.ค.', patients: 320 }, { name: 'ก.พ.', patients: 450 },
  { name: 'มี.ค.', patients: 380 }, { name: 'เม.ย.', patients: 510 },
  { name: 'พ.ค.', patients: 420 }, { name: 'มิ.ย.', patients: 600 },
];

const deptData = [
  { name: 'อายุรกรรม', value: 35 }, { name: 'ศัลยกรรม', value: 20 },
  { name: 'กุมารเวช', value: 18 }, { name: 'สูตินรี', value: 15 }, { name: 'อื่นๆ', value: 12 },
];
const COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

export default function SMPDashboard() {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard title="ผู้ป่วยทั้งหมด" value="2,845" icon={<IconUsers size={24} />} color="#0ea5e9" subtitle="+12% จากเดือนที่แล้ว" />
        <StatCard title="บุคลากร" value="156" icon={<IconStethoscope size={24} />} color="#8b5cf6" subtitle="แพทย์ 48 / พยาบาล 108" />
        <StatCard title="คิววันนี้" value="32" icon={<IconClock size={24} />} color="#f59e0b" subtitle="รอคัดกรอง 12 ราย" />
        <StatCard title="แผนก" value="8" icon={<IconBuilding size={24} />} color="#10b981" subtitle="เปิดให้บริการ 7 แผนก" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>ผู้ป่วยรายเดือน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="patients" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>สัดส่วนแผนก</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={deptData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
