import { Typography, Link, IconButton, Stack } from '@mui/material';
import Image from '@/demo/villagefund/components/base/Image';
import IconifyIcon from '@/demo/villagefund/components/base/IconifyIcon';

interface LogoProps {
  onDrawerToggle: () => void;
}

const Logo = ({ onDrawerToggle }: LogoProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Link href="/" sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
        <Stack direction="column" alignItems="center">
          <Image src={"/fund-logo.png"} alt="Logo" sx={{ width: 30 }} />
          <Typography variant="h6" sx={{ mt: 0.5 }}>
            กองทุนหมู่บ้าน
          </Typography>
        </Stack>
      </Link>
      <IconButton onClick={onDrawerToggle} sx={{ display: { md: 'none' } }}>
        <IconifyIcon icon="mingcute:menu-line" color="primary.darker" width={25} />
      </IconButton>
    </Stack>
  );
};

export default Logo;
