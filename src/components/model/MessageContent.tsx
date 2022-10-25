import { Stack, Typography } from '@mui/material';
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
      {user && <UserAvatar size={40} user={user} />}
      <Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            {user?.display_name ?? user?.username}
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
