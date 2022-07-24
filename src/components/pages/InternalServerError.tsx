import { Box, Grid, Stack, Typography } from '@mui/material';

const InternalServerError = () => (
  <Grid container justifyContent="center">
    <Stack spacing={1} margin={20}>
      <Box component="img" alt="500" src="/error/500.svg" />
      <Typography padding={5} align="center" variant="h3">
        Internal Server Error
      </Typography>
    </Stack>
  </Grid>
);

export default InternalServerError;
