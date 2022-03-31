/* eslint-disable no-unused-vars */
import {
  Avatar,
  Button,
  Typography,
  Link,
  Stack,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import * as React from 'react';
import { User } from '../../api/generated/api';

type Props = {
  user: User | null;
  isOwner: boolean;
  isFollower: boolean;
  disabled: boolean;
  followUser: (userId: number) => void;
  unfollowUser: (userId: number) => void;
};

const UserCard: React.VFC<Props> = ({
  user,
  isOwner,
  isFollower,
  disabled,
  followUser,
  unfollowUser,
}: Props) => {

  const navigate = useNavigate();
  const buttonText = () => {
    if (isOwner) {
      return 'edit profile';
    }
    return isFollower ? 'Unfollow' : 'Follow';
  }
  const handleButtonClick = () => {
    if (!user?.id) {
      return;
    }
    if (isOwner) {
      navigate('/settings/account');
    }
    if (isFollower) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  return (
    <Stack spacing={1}>
      <Stack direction={{ xs: 'row', sm: 'column' }} spacing={{ xs: 2, sm: 0 }}>
        <Avatar
          sx={{ width: { xs: 80, sm: 148, md: 296 }, height: { xs: 80, sm: 148, md: 296 }, alignSelf: 'center' }}
          src={user?.profile_image}
        />
        <Stack>
          <Typography sx={{ fontWeight: 'bold' }} variant="h4">
            {user?.display_name ?? user?.username}
          </Typography>
          <Typography variant="h6">{user?.username}</Typography>
          <Typography variant="body2">{user?.status_message}</Typography>
        </Stack>
      </Stack>
      <Button
        sx={{ height: 30 }}
        color="inherit"
        variant="contained"
        disabled={disabled}
        onClick={handleButtonClick}
      >
        {buttonText()}
      </Button>
      <Typography variant="subtitle2">
        {user?.followers} follower, {user?.following} followings
      </Typography>
    </Stack>
  );
};

export default UserCard;
