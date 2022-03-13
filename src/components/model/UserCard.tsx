import {
  Avatar,
  Button,
  Card,
  CardContent,
  Typography,
  Link,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { User } from '../../api/generated/api';

type Props = {
  user: User | null;
  isOwner: boolean;
  isFollower: boolean;
  loading: boolean;
  followUser: (userId: number) => void;
  unfollowUser: (userId: number) => void;
};

const UserCard: React.VFC<Props> = ({
  user,
  isOwner,
  isFollower,
  loading,
  followUser,
  unfollowUser,
}) => {
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!user?.id) {
      return;
    }
    if (isFollower) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  const ActionButton = (isOwner: boolean) => {
    if (isOwner) {
      return (
        <Link
          component={NavLink}
          color="inherit"
          underline="none"
          to="/settings"
        >
          <Button
            sx={{ width: 296, height: 30 }}
            color="inherit"
            variant="contained"
          >
            Edit Profile
          </Button>
        </Link>
      );
    }
    return (
      <Button
        sx={{ width: 296, height: 30 }}
        color="inherit"
        variant="contained"
        disabled={loading}
        onClick={(e) => handleButtonClick(e)}
      >
        {isFollower ? 'Unfollow' : 'Follow'}
      </Button>
    );
  };

  return (
    <Card
      sx={{
        width: 328,
      }}
    >
      <CardContent>
        <Avatar sx={{ width: 296, height: 296 }} src={user?.profile_image} />
        <Typography sx={{ fontWeight: 'bold' }} variant="h4">
          {user?.display_name ?? user?.username}
        </Typography>
        <Typography variant="subtitle1">{user?.username}</Typography>
        {ActionButton(isOwner)}
        <Typography variant="body2">{user?.status_message}</Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
