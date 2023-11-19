import Box, { BoxProps } from '@mui/material/Box';
import { forwardRef } from 'react';

export type { BoxProps as CenterContentProps };

export const CenterContent = forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <Box
    display='flex'
    justifyContent='center'
    alignItems='center'
    textAlign='center'
    overflow='hidden'
    height='100%'
    width='100%'
    {...props}
    ref={ref}
  />
));
