import { Box } from '@mui/material';
import { type BoxProps, type SxProps } from '@mui/system';
import { type ImgHTMLAttributes } from 'react';

interface ImageProps extends BoxProps {
  src: ImgHTMLAttributes<HTMLImageElement>['src'];
  alt: string;
  sx?: SxProps;
}

const Image = ({ src, alt, ...rest }: ImageProps) => {
  return <Box component="img" src={src} alt={alt} {...rest} />;
};

export default Image;
