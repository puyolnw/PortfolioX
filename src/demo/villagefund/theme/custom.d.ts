import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    gradients: {
      primary: string;
      secondary: string;
      error: string;
      warning: string;
      info: string;
      success: string;
    };
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    gradients?: {
      primary?: string;
      secondary?: string;
      error?: string;
      warning?: string;
      info?: string;
      success?: string;
    };
  }
  interface PaletteColor {
    darker?: string;
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    darker?: string;
    lighter?: string;
  }
}
