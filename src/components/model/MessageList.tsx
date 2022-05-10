import { Stack, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { Channel } from '../../api/generated';
import MessageContent from './MessageContent';
import MessageInput from './MessageInput';
import { CHAT_MESSAGE_CONTENT_HEIGHT } from '../config/constants';

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
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        paddingBottom={1.5}
      >
        {channelIcon(channel?.is_protected ?? false)}
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          {channel?.name}
        </Typography>
      </Stack>
      <Stack
        spacing={2}
        height={CHAT_MESSAGE_CONTENT_HEIGHT}
        sx={{ overflowY: 'auto' }}
      >
        {channel?.id
          ? [...Array(channel.id)].map((_, index) => (
              <MessageContent
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                user={
                  index % 2
                    ? { id: 1, username: 'testUser' }
                    : { id: 2, username: 'dummyUser' }
                }
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                createdAt={new Date()}
              />
            ))
          : null}
      </Stack>
      <MessageInput />
    </Stack>
  );
};

export default MessageList;
