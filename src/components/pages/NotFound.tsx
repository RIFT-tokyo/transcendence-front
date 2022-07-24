import { Box, Grid, Stack, Typography } from '@mui/material';

const NotFound = () => (
  <Grid container justifyContent="center">
    <Stack spacing={1} margin={20}>
      <Box component="img" alt="404" src="/error/404.svg" />
      <Typography padding={5} align="center" variant="h3">
        Not Found
      </Typography>
    </Stack>
  </Grid>
);

export default NotFound;
