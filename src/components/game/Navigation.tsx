import { Box, Button, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

const Navigation = () => (
  <Box
    component="div"
    maxHeight="calc(100vh - 220px)"
    padding={2}
    sx={{ overflow: 'auto' }}
  >
    <Box
      margin="auto"
      component="div"
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="sm"
    >
      <Grid container spacing={10}>
        <Grid
          item
          xs={12}
          marginY={10}
          alignItems="center"
          display="flex"
          direction="column"
        >
          <Typography
            variant="h1"
            color={blueGrey[200]}
            sx={{
              fontFamily: 'Zen Tokyo Zoo',
            }}
          >
            PONG
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={5} marginY={5}>
          <Grid item xs={6}>
            <Button fullWidth size="large" variant="contained" color="inherit">
              host match
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth size="large" variant="contained" color="inherit">
              join match
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </Box>
);

export default Navigation;
