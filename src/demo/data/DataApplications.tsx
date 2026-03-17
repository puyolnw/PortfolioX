import { IconEye, IconCheck, IconX } from '@tabler/icons-react';

const mockApplications = [
  { id: 1, student: 'กานต์ สายลม', studentId: '6501005', job: 'ผู้ช่วยบัญชี', company: 'สำนักงานบัญชี ABC', appliedDate: '10/03/2569', status: 'pending' },
  { id: 2, student: 'ปิยะ ดวงดาว', studentId: '6501006', job: 'IT Support', company: 'บริษัท เทค จำกัด', appliedDate: '08/03/2569', status: 'admin_approved' },
  { id: 3, student: 'ธนพล สุขสวัสดิ์', studentId: '6501007', job: 'พนักงานขาย', company: 'ห้างสรรพสินค้า XYZ', appliedDate: '05/03/2569', status: 'pending' },
  { id: 4, student: 'สมชาย ใจดี', studentId: '6501001', job: 'Web Developer', company: 'บริษัท ซอฟต์แวร์ จำกัด', appliedDate: '01/02/2569', status: 'accepted' },
  { id: 5, student: 'สมหญิง รักเรียน', studentId: '6501002', job: 'Graphic Designer', company: 'บริษัท ดีไซน์ จำกัด', appliedDate: '15/01/2569', status: 'accepted' },
  { id: 6, student: 'มนัสนันท์ เพชรงาม', studentId: '6501008', job: 'Content Writer', company: 'บริษัท มาร์เก็ตติ้ง จำกัด', appliedDate: '12/03/2569', status: 'pending' },
  { id: 7, student: 'นริศรา พลอยสวย', studentId: '6501004', job: 'Data Entry', company: 'บริษัท ข้อมูล จำกัด', appliedDate: '07/03/2569', status: 'rejected' },
];

export default function DataApplications() {
  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: '#fef9c3', color: '#ca8a04', label: 'รอพิจารณา' },
    admin_approved: { bg: '#dbeafe', color: '#2563eb', label: 'อนุมัติโดยผู้ดูแล' },
    accepted: { bg: '#dcfce7', color: '#16a34a', label: 'ตอบรับแล้ว' },
    rejected: { bg: '#fee2e2', color: '#dc2626', label: 'ปฏิเสธ' },
  };

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>จัดการข้อมูลการสมัคร</h1>
      <p style={{ margin: '0 0 24px', color: '#919eab', fontSize: '0.88rem' }}>ตรวจสอบและจัดการใบสมัครงานของนักศึกษา</p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'ทั้งหมด', value: mockApplications.length, bg: '#f8f9fa', color: '#212b36' },
          { label: 'รอพิจารณา', value: mockApplications.filter(a => a.status === 'pending').length, bg: '#fef9c3', color: '#ca8a04' },
          { label: 'ตอบรับแล้ว', value: mockApplications.filter(a => a.status === 'accepted').length, bg: '#dcfce7', color: '#16a34a' },
          { label: 'ปฏิเสธ', value: mockApplications.filter(a => a.status === 'rejected').length, bg: '#fee2e2', color: '#dc2626' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: '#637381', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {['#', 'นักศึกษา', 'รหัส', 'ตำแหน่งที่สมัคร', 'สถานประกอบการ', 'วันที่สมัคร', 'สถานะ', 'จัดการ'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockApplications.map((a, i) => {
                const st = statusMap[a.status] || statusMap.pending;
                return (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '12px 16px', color: '#919eab' }}>{i + 1}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{a.student}</td>
                    <td style={{ padding: '12px 16px', color: '#919eab' }}>{a.studentId}</td>
                    <td style={{ padding: '12px 16px' }}>{a.job}</td>
                    <td style={{ padding: '12px 16px' }}>{a.company}</td>
                    <td style={{ padding: '12px 16px', color: '#919eab' }}>{a.appliedDate}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: 20, background: st.bg, color: st.color, fontSize: '0.75rem', fontWeight: 700 }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button title="ดู" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2', padding: 4 }}><IconEye size={16} /></button>
                        {a.status === 'pending' && <>
                          <button title="อนุมัติ" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: 4 }}><IconCheck size={16} /></button>
                          <button title="ปฏิเสธ" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 4 }}><IconX size={16} /></button>
                        </>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
