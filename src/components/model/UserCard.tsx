import { Avatar, Button, Card, CardContent, Typography, Link } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { User } from '../../api/generated/api';

const UserCard: React.VFC<{user: User | null, isOwner: boolean, isFollower: boolean}> = ({user, isOwner, isFollower}) => {
  const ActionButton = (isOwner: boolean) => {
    if (isOwner) {
      return (
        <Link component={NavLink} color='inherit' underline='none' to='/settings'>
          <Button sx={{ width: 296, height: 30 }} color='inherit' variant='contained'>Edit Profile</Button>
        </Link>
      )
    }
    return (
      <Button sx={{ width: 296, height: 30 }} color='inherit' variant='contained'>{isFollower ? "Unfollow" : "Follow"}</Button>
    )
  }

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
        {ActionButton(isOwner)}
        <Typography variant="body2">{user?.status_message}</Typography>
      </CardContent>
    </Card>
  )
}

export default UserCard
