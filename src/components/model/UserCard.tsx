import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { user } from '../types/user';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  };
}

const UserCard = () => {
  const [userState] = useState<user>({id: 1, name: 'John Doe'});

  return (
    <Box sx={{ maxWidth: 275 }}>
      <Card style={{backgroundColor: '#00babc'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar {...stringAvatar(userState.name)}/>
            </Grid>
            <Grid item>
              <Typography variant="h5">{userState.name}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserCard
