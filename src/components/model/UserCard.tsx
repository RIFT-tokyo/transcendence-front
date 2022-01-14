import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { userType } from '../types/user';
import TextAvatar from '../ui/TextAvatar';

const UserCard = () => {
  const [user, setUser] = useState<userType|null>(null);

  useEffect(() => {
    fetch("http://localhost:3100/users/1")
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  return (
    <Box sx={{ maxWidth: 275 }}>
      <Card style={{backgroundColor: '#00babc'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item>
              {user && <TextAvatar text={user.name} />}
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
