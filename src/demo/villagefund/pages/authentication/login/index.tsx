import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted'); // ตรวจสอบว่าฟังก์ชันถูกเรียกใช้
    try {
      const response = await axios.post(`${import.meta.env.Vite_API_URL}/login`, { username, password });
      const { token } = response.data;
      // จัดเก็บโทเค็นใน localStorage หรือ sessionStorage
      localStorage.setItem('token', token);
      // นำทางผู้ใช้ไปยังหน้าอื่นหลังจากเข้าสู่ระบบสำเร็จ
      window.location.href = '/';
    } catch (err) {
      console.error('Login error:', err); // แสดงข้อผิดพลาดในคอนโซล
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        เข้าสู่ระบบ
      </Button>
    </form>
  );
};

export default LoginForm;
