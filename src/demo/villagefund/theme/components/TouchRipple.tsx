// @ts-nocheck
import { type Theme } from '@mui/material';
import { Components } from '@mui/material/styles/';

const TouchRippleComponent: Components<Omit<Theme, 'components'>>['MuiTouchRipple'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.neutral.main,
    }),
    childPulsate: {
      animation: 'none',
    },
    rippleVisible: {
      animation: 'none',
    },
    child: ({ theme }) => ({
      backgroundColor: theme.palette.primary.dark,
    }),
  },
};

export default TouchRippleComponent;
