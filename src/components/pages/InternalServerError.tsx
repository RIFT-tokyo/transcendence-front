import { Container, Stack, Typography } from '@mui/material'

const InternalServerError = () => {
  return (
    <Container>
      <Stack spacing={1} margin={20}>
        <img src="/error/500.svg" alt="500" />
        <Typography padding={5} align='center' variant="h3">Internal Server Error</Typography>
      </Stack>
    </Container>
  )
}

export default InternalServerError
