/* eslint-disable no-unused-vars */
import { Avatar, Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { User } from '../../api/generated/api';
import { SETTING_URL } from '../config/constants';
import stringToColor from '../../functions/stringToColor';

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
    return isFollower ? 'unfollow' : 'follow';
  };
  const handleButtonClick = () => {
    if (!user?.id) {
      return;
    }
    if (isOwner) {
      navigate(SETTING_URL);
      return;
    }
    if (isFollower) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  return (
    <Stack sx={{ width: 296 }}>
      <Avatar
        sx={{
          width: 296,
          height: 296,
          bgcolor: user?.profile_image ? undefined : stringToColor(user?.username ?? ''),
        }}
        src={user?.profile_image}
      />
      <Typography sx={{ fontWeight: 'bold' }} variant="h4">
        {user?.display_name ?? user?.username}
      </Typography>
      <Typography variant="h6">{user?.username}</Typography>
      <Typography variant="body1">{user?.status_message}</Typography>
      <Typography variant="subtitle1">
        {user?.followers} followers, {user?.following} followings
      </Typography>
      <Button
        sx={{ width: 296, height: 30 }}
        color="inherit"
        variant="contained"
        disabled={disabled}
        onClick={handleButtonClick}
      >
        {buttonText()}
      </Button>
    </Stack>
  );
};

export default UserCard;
