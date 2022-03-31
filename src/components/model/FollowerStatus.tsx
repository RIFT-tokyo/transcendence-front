import { Avatar, Badge, Link, Stack, styled, Typography } from '@mui/material';
import ChatBubble from '@mui/icons-material/ChatBubble';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import { User, UserStatusEnum } from '../../api/generated/api';

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
      <Link component={NavLink} to={`/users/${user?.username}`}>
        <StyledBadge
          color={selectBadgeColor(user?.status)}
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar sx={{ width: 40, height: 40 }} src={user?.profile_image} />
        </StyledBadge>
      </Link>
      <Stack direction="column" sx={{ minWidth: 0, width: '100%' }}>
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
        <Typography noWrap variant="body2">{user?.status_message}</Typography>
      </Stack>
      <ChatBubble sx={{ fontSize: 24 }} color="neutral" />
    </Stack>
  );
};

export default FollowerStatus;
