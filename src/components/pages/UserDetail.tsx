import { Container, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { userType } from '../types/user'
import TextAvatar from '../ui/TextAvatar'

const UserDetail = () => {
  const [user, setUser] = useState<userType|null>(null)

  useEffect(() => {
    fetch("http://localhost:3100/users/1")
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item>
          <TextAvatar text={user ? user?.name as string : ""} />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">ID: {user?.id}</Typography>
          <Typography variant="h4">{user?.name}</Typography>
        </Grid>
      </Grid>
      <Typography variant="body1">created at: {user?.created_at}</Typography>
      <Typography variant="body1">updated at: {user?.updated_at}</Typography>
    </Container>
  )
}

export default UserDetail