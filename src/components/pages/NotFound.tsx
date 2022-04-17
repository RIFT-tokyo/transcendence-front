import { Grid, Stack, Typography } from '@mui/material';

const NotFound = () => (
  <Grid container justifyContent="center">
    <Stack spacing={1} margin={20}>
      <img src="/error/404.svg" alt="404" />
      <Typography padding={5} align="center" variant="h3">
        Not Found
      </Typography>
    </Stack>
  </Grid>
);

export default NotFound;
