import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { FOOTER_HEIGHT } from '../config/constants';

const GlobalFooter: React.VFC = () => (
  <Box
    component="footer"
    height={FOOTER_HEIGHT}
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Typography
      variant="body2"
      align="center"
      color="text.secondary"
      component="p"
    >
      {'App icon by '}
      <Link color="inherit" href="https://icons8.com">
        icons8
      </Link>
      {', © '}
      {new Date().getFullYear()}{' '}
      <Link color="inherit" href="https://github.com/RIFT-tokyo">
        RIFT Tokyo
      </Link>{' '}
    </Typography>
  </Box>
);

export default GlobalFooter;
