import { BottomNavigation, Box, Grid, Paper } from '@mui/material';
import * as React from 'react';

type Props = {
  children: React.ReactNode;
};

const SettingBottomNavigation: React.FC<Props> = ({ children }) => (
  <Box sx={{ pb: 10 }}>
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, pb: 2 }}
      elevation={3}
    >
      <BottomNavigation>
        <Grid container justifyContent="center">
          {children}
        </Grid>
      </BottomNavigation>
    </Paper>
  </Box>
);

export default SettingBottomNavigation;
