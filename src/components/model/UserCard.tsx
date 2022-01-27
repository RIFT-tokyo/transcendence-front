import { Avatar, Card, CardContent, Typography } from '@mui/material'
import { ResponseUser } from '../../api/generated/api';

const UserCard: React.VFC<{user: ResponseUser | null}> = ({user}) => {
  return (
    <Card sx={{
      width: 320,
      height: 384,
      margin: '20px',
    }}>
      <CardContent>
        { user?.profile_image ? <Avatar sx={{ width: 256, height: 256, margin: 'auto' }} src={user.profile_image}/> : <Avatar sx={{ width: 256, height: 256, margin: 'auto' }} /> }
        <Typography sx={{fontWeight: "bold"}} variant="h4">{user?.display_name ? user?.display_name : user?.username}</Typography>
        <Typography variant="subtitle1">{user?.username}</Typography>
        <Typography variant="body2">{user?.status_message}</Typography>
      </CardContent>
    </Card>
  )
}

export default UserCard
