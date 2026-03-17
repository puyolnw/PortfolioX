// @ts-nocheck
import { type Theme } from '@mui/material';
import { Components } from '@mui/material/styles/';

const DrawerComponent: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  defaultProps: {},
  styleOverrides: {
    paper: ({ theme }) => ({
      background: theme.palette.common.white,
      borderRightWidth: 1,
      borderColor: theme.palette.action.focus,
    }),
    // docked: ({ theme }) => ({
    //   background: theme.palette.common.black,
    // }),
  },
};

export default DrawerComponent;
