// @ts-nocheck
import { type Theme } from '@mui/material';
import { Components } from '@mui/material/styles/';

const PaginationItemComponent: Components<Omit<Theme, 'components'>>['MuiPaginationItem'] = {
  defaultProps: {},
  styleOverrides: {
    rounded: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius * 2.2,
    }),
  },
};

export default PaginationItemComponent;
