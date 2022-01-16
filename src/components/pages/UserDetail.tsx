import { Container, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import TextAvatar from '../ui/TextAvatar'
import { User, UserApi } from '../../api/generated/api';

const UserDetail = () => {
  const [user, setUser] = useState<User|null>(null)
  const userApi = new UserApi()

  useEffect(() => {
    (async () => {
      const user = await userApi.getUsersUserId(1)
      setUser(user.data)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        <Grid item>
          <TextAvatar text={user ? user?.name : ""} />
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