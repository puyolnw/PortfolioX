import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  styled,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface MemberDetailModalProps {
  open: boolean;
  onClose: () => void;
  member: {
    member_id: number;
    id_card_number: string;
    full_name: string;
    birth_date: string;
    gender: string;
    house_code: string;
    address: string;
    phone_number: string;
    marital_status: string;
  } | null;
}

const DetailSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  borderRadius: 12,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    transform: 'translateX(4px)',
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 12,
  marginRight: theme.spacing(2),
  background: 'linear-gradient(135deg, #6B8DE3 0%, #7C4DFF 100%)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'rotate(5deg)',
  }
}));

const StyledDialog = styled(Dialog)(({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    overflow: 'hidden',
  }
}));

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ open, onClose, member }) => {
  
  if (!member) return null;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: 3, 
          background: 'linear-gradient(135deg, #4A90E2 0%, #7C4DFF 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <PersonIcon sx={{ mr: 2, fontSize: 28 }} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          ข้อมูลสมาชิก
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              transform: 'rotate(90deg)',
              transition: 'all 0.3s ease',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#F8FAFF' }}>
        <DetailSection>
          <Typography variant="h6" sx={{ 
            mb: 3, 
            color: '#4A90E2', 
            fontWeight: 700,
            borderBottom: '2px solid #4A90E2',
            paddingBottom: 1,
            display: 'inline-block'
          }}>
            ข้อมูลส่วนตัว
          </Typography>
          
          <DetailRow>
            <IconWrapper>
              <BadgeIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                เลขบัตรประชาชน
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {member.id_card_number}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <PersonIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                ชื่อ-นามสกุล
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {member.full_name}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <CakeIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                วันเกิด
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {new Date(member.birth_date).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <WcIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                เพศ
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {member.gender}
              </Typography>
            </Box>
          </DetailRow>
        </DetailSection>

        <DetailSection>
          <Typography variant="h6" sx={{ 
            mb: 3, 
            color: '#4A90E2', 
            fontWeight: 700,
            borderBottom: '2px solid #4A90E2',
            paddingBottom: 1,
            display: 'inline-block'
          }}>
            ข้อมูลติดต่อ
          </Typography>

          <DetailRow>
            <IconWrapper>
              <HomeIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                รหัสบ้าน
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {member.house_code}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <LocationOnIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                ที่อยู่
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {member.address}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <PhoneIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                เบอร์โทรศัพท์
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {member.phone_number}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <FavoriteIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                สถานภาพ
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {member.marital_status}
              </Typography>
            </Box>
          </DetailRow>
        </DetailSection>
      </DialogContent>
    </StyledDialog>
  );
};

export default MemberDetailModal;