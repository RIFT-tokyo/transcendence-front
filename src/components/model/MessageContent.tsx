import { Link, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { format } from 'date-fns';
import { User } from '../../api/generated';
import UserAvatar from './UserAvatar';

type Props = {
  user: User | null;
  text: string;
  createdAt: Date;
};

const MessageContent = (props: Props) => {
  const { user, text, createdAt } = props;

  return (
    <Stack direction="row" spacing={1}>
      { user &&
        <Link component={NavLink} underline="none" to={`/users/${user.username}`}>
          <UserAvatar size={40} user={user} />
        </Link>
      }
      <Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            <Link component={NavLink} color="inherit" underline="none" to={`/users/${user?.username}`}>
              {user?.display_name ?? user?.username}
            </Link>
          </Typography>
          <Typography variant="body2">
            {format(new Date(createdAt), 'yyyy/MM/dd HH:mm')}
          </Typography>
        </Stack>
        <Typography whiteSpace="pre-wrap">{text}</Typography>
      </Stack>
    </Stack>
  );
};

export default MessageContent;
