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
    <Stack sx={{ width: 296 }}>
      <Avatar sx={{ width: 296, height: 296 }} src={user?.profile_image} />
      <Typography sx={{ fontWeight: 'bold' }} variant="h4">
        {user?.display_name ?? user?.username}
      </Typography>
      <Typography variant="h6">{user?.username}</Typography>
      <Button
        sx={{ width: 296, height: 30 }}
        color="inherit"
        variant="contained"
        disabled={disabled}
        onClick={handleButtonClick}
      >
        {buttonText()}
      </Button>
      <Typography variant="body1">{user?.status_message}</Typography>
      <Typography variant="subtitle2">{user?.followers} follower, {user?.following} followings</Typography>
    </Stack>
  );
};

export default UserCard;
