import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  Snackbar 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Account {
  account_id: number;
  member_id: number;
  account_number: string;
  account_type: string;
  branch: string;
  balance: string;
  full_name: string;
  id_card_number: string;
}

const SearchAccount: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('กรุณากรอกข้อมูลที่ต้องการค้นหา');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // เรียกใช้ API เพื่อค้นหาบัญชี
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts`);
      const accounts = response.data;
      
      // กรองข้อมูลตามคำค้นหา
      const filteredAccounts = accounts.filter((account: Account) => 
        account.account_number.includes(trimmedQuery) ||
        account.full_name?.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        account.id_card_number?.includes(trimmedQuery)
      );

      if (filteredAccounts.length === 1) {
        // ถ้าเจอบัญชีเดียว ไปที่หน้ารายละเอียดบัญชีนั้นเลย
        navigate('/bankbook', { 
          state: { 
            accountInfo: filteredAccounts[0]
          } 
        });
      } else if (filteredAccounts.length > 1) {
        // ถ้าเจอหลายบัญชี ไปที่หน้าแสดงผลการค้นหา
        navigate('/searchresults', { 
          state: { 
            results: filteredAccounts
          } 
        });
      } else {
        setError('ไม่พบบัญชีที่ตรงกับการค้นหา');
        setShowError(true);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
      setShowError(true);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query, navigate]);

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 2,
      }}
    >
      <Paper
        sx={{
          height: 'auto',
          minHeight: '80vh',
          width: '90%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e3f2fd',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
          position: 'relative',
          padding: { xs: 2, sm: 4 },
          marginTop: 1,
          border: '1px solid #bbdefb',
        }}
      >
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom 
          sx={{ fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, color: '#0d47a1' }}
        >
          ค้นหาบัญชีธนาคาร
        </Typography>

        <TextField
          fullWidth
          label="เลขบัญชี, ชื่อ-นามสกุล หรือเลขบัตรประชาชน"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          disabled={isLoading}
          sx={{
            mb: 3,
            maxWidth: '60%',
            width: '60%',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#90caf9' },
              '&:hover fieldset': { borderColor: '#64b5f6' },
              '&.Mui-focused fieldset': { borderColor: '#0d47a1' },
            },
          }}
          InputProps={{
            style: { fontSize: '1.5rem', color: '#1976d2' }
          }}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          startIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
          disabled={isLoading}
          sx={{
            fontSize: '1.2rem',
            padding: '10px 30px',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
        </Button>

        <Snackbar 
          open={showError} 
          autoHideDuration={6000} 
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowError(false)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default SearchAccount;