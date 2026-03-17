// @ts-nocheck
import { createTheme, type Shadows } from '@mui/material';
import AppBarComponent from '@/demo/villagefund/theme/components/AppBar';
import AvatarComponent from '@/demo/villagefund/theme/components/Avatar';
import ButtonComponent from '@/demo/villagefund/theme/components/Button';
import ButtonBaseComponent from '@/demo/villagefund/theme/components/ButtonBase';
import CardComponent from '@/demo/villagefund/theme/components/Card';
import CardContentComponent from '@/demo/villagefund/theme/components/CardContent';
import CssBaselineComponent from '@/demo/villagefund/theme/components/CssBaseline';
import DataGridComponent from '@/demo/villagefund/theme/components/DataGrid';
import DrawerComponent from '@/demo/villagefund/theme/components/Drawer';
import FilledInputComponent from '@/demo/villagefund/theme/components/form/FilledInput';
import InputComponent from '@/demo/villagefund/theme/components/form/Input';
import InputAdornmentComponent from '@/demo/villagefund/theme/components/form/InputAdornment';
import InputBaseComponent from '@/demo/villagefund/theme/components/form/InputBase';
import InputLabelComponent from '@/demo/villagefund/theme/components/form/InputLabel';
import OutlinedInputComponent from '@/demo/villagefund/theme/components/form/OutlinedInput';
import IconButtonComponent from '@/demo/villagefund/theme/components/IconButton';
import LinkComponent from '@/demo/villagefund/theme/components/Link';
import ListItemComponent from '@/demo/villagefund/theme/components/list/ListItem';
import ListItemTextComponent from '@/demo/villagefund/theme/components/list/ListItemText';
import MenuComponent from '@/demo/villagefund/theme/components/list/Menu';
import PaginationComponent from '@/demo/villagefund/theme/components/Pagination';
import PaginationItemComponent from '@/demo/villagefund/theme/components/pagination/PaginationItem';
import TabComponent from '@/demo/villagefund/theme/components/Tab';
import TabsComponent from '@/demo/villagefund/theme/components/Tabs';
import ToolbarComponent from '@/demo/villagefund/theme/components/Toolbar';
import TouchRippleComponent from '@/demo/villagefund/theme/components/TouchRipple';
// import type {} from '@mui/x-data-grid/themeAugmentation';
import palette from '@/demo/villagefund/theme/palette';
import shadows from '@/demo/villagefund/theme/shadows';
import typography from '@/demo/villagefund/theme/typography';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}
export const theme = createTheme({
  palette,
  typography,
  shadows: [...shadows] as Shadows,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920,
    },
  },
  components: {
    MuiAppBar: AppBarComponent,
    MuiAvatar: AvatarComponent,
    MuiButton: ButtonComponent,
    MuiButtonBase: ButtonBaseComponent,
    MuiCard: CardComponent,
    MuiCardContent: CardContentComponent,
    MuiCssBaseline: CssBaselineComponent,
    MuiDataGrid: DataGridComponent,
    MuiDrawer: DrawerComponent,
    MuiFilledInput: FilledInputComponent,
    MuiIconButton: IconButtonComponent,
    MuiInput: InputComponent,
    MuiInputBase: InputBaseComponent,
    MuiInputLabel: InputLabelComponent,
    MuiInputAdornment: InputAdornmentComponent,
    MuiLink: LinkComponent,
    MuiListItem: ListItemComponent,
    MuiListItemText: ListItemTextComponent,
    MuiMenu: MenuComponent,
    MuiOutlinedInput: OutlinedInputComponent,
    MuiPagination: PaginationComponent,
    MuiPaginationItem: PaginationItemComponent,
    MuiTab: TabComponent,
    MuiTabs: TabsComponent,
    MuiToolbar: ToolbarComponent,
    MuiTouchRipple: TouchRippleComponent,
  },
});
