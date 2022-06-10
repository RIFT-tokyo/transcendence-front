import { Avatar, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { User } from '../../api/generated';
import stringToColor from '../../functions/stringToColor';

type Props = {
  user: User | null;
  text: string;
  createdAt: Date;
};

const MessageContent = (props: Props) => {
  const { user, text, createdAt } = props;

  return (
    <Stack direction="row" spacing={1}>
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
      <Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ fontWeight: 'bold' }} variant="h6">
            {user?.display_name ?? user?.username}
          </Typography>
          <Typography variant="body2">
            {format(new Date(createdAt), 'yyyy/MM/dd HH:mm')}
          </Typography>
        </Stack>
        <Typography>{text}</Typography>
      </Stack>
    </Stack>
  );
};

export default MessageContent;
