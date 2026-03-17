
declare module 'swiper/css';
declare module 'swiper/css/*';
declare module '*.css';
declare module '*.module.css';

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
      blueGradient?: string;
      whiteGradient?: string;
      whiteCardGradient?: string;
      [key: string]: string | undefined;
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
      blueGradient?: string;
      whiteGradient?: string;
      whiteCardGradient?: string;
      [key: string]: string | undefined;
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
