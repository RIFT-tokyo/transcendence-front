import { Avatar, Badge, Link, Stack, styled, Typography } from '@mui/material';
import ChatBubble from '@mui/icons-material/ChatBubble';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import { User, UserStatusEnum } from '../../api/generated/api';
import stringToColor from '../../functions/stringToColor';

type Props = {
  user: User | null;
};

const FollowerStatus: React.VFC<Props> = ({ user }: Props) => {
  const selectBadgeColor = (
    status?: UserStatusEnum,
  ): 'success' | 'error' | 'neutral' => {
    switch (status) {
      case UserStatusEnum.Online:
        return 'success';
      case UserStatusEnum.Game:
        return 'error';
      default:
        return 'neutral';
    }
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  }));

  return (
    <Stack
      direction="row"
      margin={0.5}
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Link
        component={NavLink}
        underline="none"
        to={`/users/${user?.username}`}
      >
        <StyledBadge
          color={selectBadgeColor(user?.status)}
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: user?.profile_image
                ? undefined
                : stringToColor(user?.username ?? ''),
            }}
            src={user?.profile_image}
          >
            {user?.username?.slice(0, 2) ?? ''}
          </Avatar>
        </StyledBadge>
      </Link>
      <Stack sx={{ flexGrow: 1 }} direction="column">
        <Link
          component={NavLink}
          to={`/users/${user?.username}`}
          color="inherit"
          underline="none"
        >
          <Typography sx={{ fontWeight: 'bold' }}>
            {user?.display_name ?? user?.username}
          </Typography>
        </Link>
        <Typography variant="body2">{user?.status_message}</Typography>
      </Stack>
      <ChatBubble sx={{ fontSize: 24 }} color="neutral" />
    </Stack>
  );
};

export default FollowerStatus;
