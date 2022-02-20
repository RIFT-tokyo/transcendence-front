import { Box, Grid } from '@mui/material';
import { ReactNode } from 'react';

const Footer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Grid container justifyContent='center'>
        {children}
      </Grid>
    </Box>
  )
}

export default Footer