import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Copyright = () => (
  <Typography variant="body2" color="text.secondary" align="center">
    {'Copyright © '}
    <Link color="inherit" href="https://github.com/RIFT-tokyo">
      RIFT-tokyo
    </Link>{' '}
    {new Date().getFullYear()}.
  </Typography>
);

const Footer: React.VFC = () => (
  <Box
    component="footer"
    sx={{
      bgcolor: 'background.paper',
      width: '100%',
      position: 'static',
      bottom: 0,
      pb: 10,
    }}
  >
    <Container>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          fontFamily: 'Zen Tokyo Zoo',
        }}
      >
        TRANSCENDENCE
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        color="text.secondary"
        component="p"
      >
        {'App icon by '}
        <Link color="inherit" href="https://icons8.com">
          icons8
        </Link>{' '}
      </Typography>
      <Copyright />
    </Container>
  </Box>
);

export default Footer;
