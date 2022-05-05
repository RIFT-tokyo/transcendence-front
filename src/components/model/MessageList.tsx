import { Stack, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { Channel } from '../../api/generated';
import MessageContent from './MessageContent';
import MessageInput from './MessageInput';

type Props = {
  channel: Channel | null;
};

const channelIcon = (isProtected: boolean) => {
  if (isProtected) {
    return <LockIcon />;
  }
  return <TagIcon />;
};

const MessageList = (props: Props) => {
  const { channel } = props;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        {channelIcon(channel?.is_protected ?? false)}
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          {channel?.name}
        </Typography>
      </Stack>
      {channel?.id
        ? [...Array(channel.id)].map((_, index) => (
            <MessageContent
              key={index}
              user={
                index % 2
                  ? { id: 1, username: 'testUser' }
                  : { id: 2, username: 'dummyUser' }
              }
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
              created_at={new Date()}
            />
          ))
        : null}
      <MessageInput />
    </Stack>
  );
};

export default MessageList;
