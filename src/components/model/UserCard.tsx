import { Avatar, Button, Card, CardContent, Typography } from '@mui/material'
import { ResponseUser } from '../../api/generated/api';

const UserCard: React.VFC<{user: ResponseUser | null}> = ({user}) => {
  return (
    <Card
      sx={{
        width: 328,
      }}
    >
      <CardContent>
        <Avatar sx={{ width: 296, height: 296 }} src={user?.profile_image}/>
        <Typography sx={{fontWeight: "bold"}} variant="h4">{user?.display_name ?? user?.username}</Typography>
        <Typography variant="subtitle1">{user?.username}</Typography>
        <Button sx={{ width: 296, height: 30 }} color='inherit' variant='contained'>Edit Profile</Button>
        <Typography variant="body2">{user?.status_message}</Typography>
      </CardContent>
    </Card>
  )
}

export default UserCard
