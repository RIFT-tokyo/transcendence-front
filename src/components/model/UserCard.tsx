/* eslint-disable no-unused-vars */
import { Avatar, Button, Typography, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import { User } from '../../api/generated/api';
import { SETTING_URL } from '../config/constants';
import stringToColor from '../../functions/stringToColor';

type Props = {
  user: User | null;
  isOwner: boolean;
  isFollower: boolean;
  isBlocking: boolean;
  disabled: boolean;
  followUser: (userId: number) => void;
  unfollowUser: (userId: number) => void;
  blockUser: (userId: number) => void;
  unblockUser: (userId: number) => void;
};

const UserCard: React.VFC<Props> = ({
  user,
  isOwner,
  isFollower,
  isBlocking,
  disabled,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
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

  const handleBlockButtonClick = () => {
    if (!user?.id) {
      return;
    }
    blockUser(user.id);
  };
  const displayName = () => {
    if (!user?.display_name) {
      return user?.username;
    }
    return user.display_name;
  };

  return (
    <Box component="div">
      <Avatar
        sx={{
          width: 296,
          height: 296,
          bgcolor: user?.profile_image
            ? undefined
            : stringToColor(user?.username ?? ''),
        }}
        src={user?.profile_image}
      />
      <Typography sx={{ fontWeight: 'bold' }} variant="h4" marginTop={1}>
        {displayName()}
      </Typography>
      <Typography variant="h6">
        {user?.display_name ? user?.username : ''}
      </Typography>
      <Typography variant="body1">{user?.status_message}</Typography>
      <Typography variant="subtitle1">
        {user?.followers} followers, {user?.following} followings
      </Typography>
      <Button
        size="small"
        fullWidth
        color="inherit"
        variant="contained"
        disabled={disabled}
        onClick={handleButtonClick}
      >
        {buttonText()}
      </Button>
      {!isOwner && (
        <Button
          size="small"
          fullWidth
          color="error"
          variant="contained"
          disabled={disabled}
          onClick={handleBlockButtonClick}
        >
          {isBlocking ? "unblock" : "block"}
        </Button>
      )}
    </Box>
  );
};

export default UserCard;
