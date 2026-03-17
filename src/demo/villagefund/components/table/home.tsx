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
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PublicIcon from '@mui/icons-material/Public';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

interface HouseDetailModalProps {
  open: boolean;
  onClose: () => void;
  house: {
    house_id: number;
    house_code: string;
    house_owner_name: string;
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    postal_code: string;
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

const HouseDetailModal: React.FC<HouseDetailModalProps> = ({ open, onClose, house }) => {
  
  if (!house) return null;

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
        <HomeIcon sx={{ mr: 2, fontSize: 28 }} />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          ข้อมูลทะเบียนบ้าน
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
            ข้อมูลหลัก
          </Typography>
          
          <DetailRow>
            <IconWrapper>
              <MarkunreadMailboxIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                รหัสบ้าน
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {house.house_code}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <PersonIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                ชื่อเจ้าของบ้าน
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {house.house_owner_name}
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
            ที่อยู่
          </Typography>

          <DetailRow>
            <IconWrapper>
              <LocationOnIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                ที่อยู่
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {house.address}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <BusinessIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                ตำบล/แขวง
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {house.subdistrict}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <ApartmentIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                อำเภอ/เขต
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {house.district}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <PublicIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                จังหวัด
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {house.province}
              </Typography>
            </Box>
          </DetailRow>

          <DetailRow>
            <IconWrapper>
              <LocalPostOfficeIcon />
            </IconWrapper>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 0.5 }}>
                รหัสไปรษณีย์
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {house.postal_code}
              </Typography>
            </Box>
          </DetailRow>
        </DetailSection>
      </DialogContent>
    </StyledDialog>
  );
};

export default HouseDetailModal;