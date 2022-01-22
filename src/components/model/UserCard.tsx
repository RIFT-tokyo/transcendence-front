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
        <Avatar sx={{ width: 256, height: 256 }} />
        <Typography sx={{fontWeight: "bold"}} variant="h4">{user?.name}</Typography>
        <Typography variant="body1">{user?.created_at}</Typography>
        <Typography variant="body1">{user?.updated_at}</Typography>
      </CardContent>
    </Card>
  )
}

export default UserCard
