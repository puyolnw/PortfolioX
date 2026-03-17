import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import api from '../services/api'

const Landing = () => {
  const { isAuthenticated, user } = useAuth()
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalStudents: 0,
    totalHours: 0,
    upcomingActivities: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/public/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    
    const roleRoutes = {
      admin: '/admin',
      staff: '/staff',
      student: '/student'
    }
    
    return roleRoutes[user.role]
  }

  return (
    <div className="landing-page" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎓</div>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 4rem)', 
            marginBottom: '20px', 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ระบบจัดการกิจกรรมนักศึกษา
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', 
            marginBottom: '40px', 
            opacity: 0.95,
            maxWidth: '800px',
            margin: '0 auto 40px auto'
          }}>
            ระบบจัดการกิจกรรมสำหรับนักศึกษา พร้อมการสะสมชั่วโมงกิจกรรม 
            และการประเมินผลแบบครบวงจร
          </p>
          
          {isAuthenticated ? (
            <a 
              href="#"
              onClick={(e) => e.preventDefault()} 
              className="btn btn-light" 
              style={{ 
                fontSize: '1.2rem', 
                padding: '15px 40px',
                borderRadius: '50px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
            >
              เข้าสู่ระบบ 🚀
            </a>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <a 
                href="#"
                onClick={(e) => e.preventDefault()} 
                className="btn btn-light" 
                style={{ 
                  fontSize: '1.2rem', 
                  padding: '15px 40px',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                เริ่มต้นใช้งาน ✨
              </a>
              <a 
                href="#"
                onClick={(e) => e.preventDefault()} 
                className="btn btn-outline-light" 
                style={{ 
                  fontSize: '1.2rem', 
                  padding: '15px 40px',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                เข้าสู่ระบบ
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '60px 0', 
        background: 'white',
        boxShadow: '0 -5px 20px rgba(0,0,0,0.1)'
      }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '30px',
            textAlign: 'center'
          }}>
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📅</div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '5px', color: '#667eea' }}>
                {stats.totalActivities}
              </h3>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>กิจกรรมทั้งหมด</p>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '5px', color: '#764ba2' }}>
                {stats.totalStudents}
              </h3>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>นักศึกษาเข้าร่วม</p>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⏰</div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '5px', color: '#f093fb' }}>
                {stats.totalHours}
              </h3>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>ชั่วโมงสะสมรวม</p>
            </div>
            
            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '5px', color: '#4facfe' }}>
                {stats.upcomingActivities}
              </h3>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>กิจกรรมที่กำลังจะมาถึง</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 0', backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              marginBottom: '20px',
              color: '#333'
            }}>
              ฟีเจอร์เด่นของระบบ
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              ระบบจัดการกิจกรรมที่ครบครัน พร้อมฟีเจอร์ที่ตอบโจทย์ทุกความต้องการ
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '40px', 
            marginTop: '60px' 
          }}>
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎓</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#333' }}>
                การสะสมชั่วโมงกิจกรรม
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                ระบบสะสมชั่วโมงกิจกรรมแบบดิจิทัล พร้อมการติดตามความก้าวหน้า
                และการออกใบรับรองอัตโนมัติ
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📱</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#333' }}>
                QR Code Check-in
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                ระบบเช็คอินด้วย QR Code ที่รวดเร็วและแม่นยำ 
                พร้อมการยืนยันการเข้าร่วมกิจกรรมแบบเรียลไทม์
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⭐</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#333' }}>
                ระบบประเมินผล
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                ระบบประเมินผลกิจกรรมแบบครบวงจร พร้อมการวิเคราะห์ข้อมูล
                และรายงานผลการประเมินแบบเรียลไทม์
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#333' }}>
                รายงานและสถิติ
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                ระบบรายงานและสถิติที่ครบครัน พร้อมการส่งออกข้อมูล
                ในรูปแบบ PDF และ Excel
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#333' }}>
                ความปลอดภัยสูง
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                ระบบรักษาความปลอดภัยระดับสูง พร้อมการเข้ารหัสข้อมูล
                และการควบคุมสิทธิ์การเข้าถึงแบบละเอียด
              </p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '40px 30px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📧</div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', color: '#333' }}>
                การแจ้งเตือน
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                ระบบแจ้งเตือนแบบครบวงจร ผ่านอีเมลและในระบบ
                เพื่อให้ไม่พลาดกิจกรรมสำคัญ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '100px 0', backgroundColor: 'white' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              marginBottom: '20px',
              color: '#333'
            }}>
              วิธีการใช้งาน
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666', 
              maxWidth: '700px', 
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              ใช้งานง่าย เพียง 3 ขั้นตอน
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '40px', 
            marginTop: '60px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 20px auto',
                fontWeight: 'bold'
              }}>
                1
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem', color: '#333' }}>
                สมัครสมาชิก
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                สร้างบัญชีผู้ใช้และเลือกบทบาทที่เหมาะสม
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 20px auto',
                fontWeight: 'bold'
              }}>
                2
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem', color: '#333' }}>
                เข้าร่วมกิจกรรม
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                เลือกกิจกรรมที่สนใจและเช็คอินด้วย QR Code
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 20px auto',
                fontWeight: 'bold'
              }}>
                3
              </div>
              <h3 style={{ marginBottom: '15px', fontSize: '1.3rem', color: '#333' }}>
                สะสมชั่วโมง
              </h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                รับชั่วโมงกิจกรรมและประเมินผลเพื่อพัฒนาต่อ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 0',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '40px',
            opacity: 0.95,
            maxWidth: '600px',
            margin: '0 auto 40px auto'
          }}>
            เข้าร่วมกับเราและเริ่มสะสมชั่วโมงกิจกรรมตั้งแต่วันนี้
          </p>
          {!isAuthenticated && (
            <a 
              href="#"
              onClick={(e) => e.preventDefault()} 
              className="btn btn-light" 
              style={{ 
                fontSize: '1.3rem', 
                padding: '20px 50px',
                borderRadius: '50px',
                fontWeight: 'bold',
                boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
            >
              สมัครสมาชิกฟรี 🎉
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#2c3e50',
        color: 'white',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <p style={{ margin: 0, opacity: 0.8 }}>
            © 2024 ระบบจัดการกิจกรรมนักศึกษา - พัฒนาด้วย ❤️ สำหรับนักศึกษา
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
