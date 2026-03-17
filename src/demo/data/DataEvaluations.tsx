import { IconStar, IconStarFilled } from '@tabler/icons-react';

const mockEvaluations = [
  { id: 1, student: 'สมชาย ใจดี', studentId: '6501001', company: 'บริษัท ซอฟต์แวร์ จำกัด', position: 'Web Developer', score: 4.5, attitude: 5, skill: 4, punctuality: 4.5, teamwork: 4.5, evaluator: 'คุณวิชัย', date: '30/04/2569' },
  { id: 2, student: 'สมหญิง รักเรียน', studentId: '6501002', company: 'บริษัท ดีไซน์ จำกัด', position: 'Graphic Designer', score: 4.8, attitude: 5, skill: 4.5, punctuality: 5, teamwork: 5, evaluator: 'คุณปิยะ', date: '15/04/2569' },
  { id: 3, student: 'วิชัย แก้วมณี', studentId: '6501003', company: 'ร้าน ABC Mart', position: 'Data Entry', score: 3.8, attitude: 4, skill: 3.5, punctuality: 4, teamwork: 3.5, evaluator: 'คุณสมศรี', date: '31/05/2569' },
  { id: 4, student: 'นริศรา พลอยสวย', studentId: '6501004', company: 'บริษัท มาร์เก็ตติ้ง จำกัด', position: 'Marketing Intern', score: 4.2, attitude: 4.5, skill: 4, punctuality: 4, teamwork: 4.5, evaluator: 'คุณนิภา', date: '30/04/2569' },
];

const renderStars = (score: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(score)) {
      stars.push(<IconStarFilled key={i} size={14} color="#f59e0b" />);
    } else if (i - 0.5 <= score) {
      stars.push(<IconStarFilled key={i} size={14} color="#fcd34d" />);
    } else {
      stars.push(<IconStar key={i} size={14} color="#e5e7eb" />);
    }
  }
  return <span style={{ display: 'flex', gap: 2, alignItems: 'center' }}>{stars} <span style={{ marginLeft: 4, fontWeight: 700, fontSize: '0.82rem' }}>{score.toFixed(1)}</span></span>;
};

export default function DataEvaluations() {
  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800, color: '#212b36' }}>ข้อมูลการประเมินนักศึกษา</h1>
      <p style={{ margin: '0 0 24px', color: '#919eab', fontSize: '0.88rem' }}>ผลการประเมินนักศึกษาจากสถานประกอบการ</p>

      {/* Average Score */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 16, padding: '24px 32px', color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div>
          <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>
            {(mockEvaluations.reduce((sum, e) => sum + e.score, 0) / mockEvaluations.length).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.88rem', opacity: 0.8, marginTop: 4 }}>คะแนนเฉลี่ยรวม</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{mockEvaluations.length}</div>
          <div style={{ fontSize: '0.82rem', opacity: 0.7 }}>นักศึกษาที่ได้รับการประเมิน</div>
        </div>
      </div>

      {/* Evaluation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: 16 }}>
        {mockEvaluations.map(ev => (
          <div key={ev.id} style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem' }}>
                {ev.student.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#212b36' }}>{ev.student}</div>
                <div style={{ fontSize: '0.78rem', color: '#919eab' }}>{ev.studentId} · {ev.position}</div>
              </div>
              {renderStars(ev.score)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '0.82rem', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8f9fa' }}>
                <span style={{ color: '#637381' }}>ทัศนคติ</span> {renderStars(ev.attitude)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8f9fa' }}>
                <span style={{ color: '#637381' }}>ทักษะ</span> {renderStars(ev.skill)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8f9fa' }}>
                <span style={{ color: '#637381' }}>การตรงเวลา</span> {renderStars(ev.punctuality)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8f9fa' }}>
                <span style={{ color: '#637381' }}>การทำงานเป็นทีม</span> {renderStars(ev.teamwork)}
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#919eab', display: 'flex', justifyContent: 'space-between' }}>
              <span>🏢 {ev.company}</span>
              <span>👤 ผู้ประเมิน: {ev.evaluator} · {ev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
