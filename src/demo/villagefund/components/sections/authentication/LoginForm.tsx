import { Button, Grid, IconButton, InputAdornment, Link, TextField } from '@mui/material';
import IconifyIcon from '@/demo/villagefund/components/base/IconifyIcon';
import { useBreakpoints } from '@/demo/villagefund/providers/useBreakpoints';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { up } = useBreakpoints();
  const upSM = up('sm');
  const handleClick = () => {
    navigate('/');
  };
  return (
    <>
      <Grid container spacing={3} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size={upSM ? 'medium' : 'small'}
            name="UserName"
            label="ชื่อผู้ใช้งาน"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size={upSM ? 'medium' : 'small'}
            name="Password"
            label="รหัสผ่าน"
            type={showPassword ? 'text' : 'Password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <IconifyIcon icon={showPassword ? 'majesticons:eye' : 'majesticons:eye-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end" sx={{ my: 3 }}>
        <Grid>
          <Link href="/authentication/forget-password" variant="subtitle2" underline="hover">
            ลืมรหัสผ่าน ?
          </Link>
        </Grid>
      </Grid>
      <Button
        fullWidth
        size={upSM ? 'large' : 'medium'}
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        เข้าสู่ระบบ
      </Button>
    </>
  );
};

export default LoginForm;
