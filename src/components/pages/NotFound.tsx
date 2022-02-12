import { Container, Stack, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Stack spacing={1} margin={20}>
        <img src="/error/404.svg" alt="404" />
        <Typography padding={5} align='center' variant="h3">Not Found</Typography>
      </Stack>
    </Container>
  )
}

export default NotFound
