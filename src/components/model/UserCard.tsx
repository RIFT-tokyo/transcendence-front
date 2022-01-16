import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import TextAvatar from '../ui/TextAvatar';
import { User, UserApi } from '../../api/generated/api';

const UserCard = () => {
  const [user, setUser] = useState<User|null>(null);
  const userApi = new UserApi()

  useEffect(() => {
    (async () => {
      const user = await userApi.getUsersUserId(1)
      setUser(user.data)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ maxWidth: 275 }}>
      <Card style={{backgroundColor: '#00babc'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item>
              <TextAvatar text={user ? user?.name : ""} />
            </Grid>
            <Grid item>
              <Typography variant="h5">{user?.name}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserCard
