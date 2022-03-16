import { Box, Grid } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Footer: React.FC<Props> = ({ children }) => (
    <Box
      component="footer"
      sx={{
        width: '100%',
        position: 'sticky',
        bottom: 0,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Grid container justifyContent="center">
        {children}
      </Grid>
    </Box>
  );

export default Footer;
