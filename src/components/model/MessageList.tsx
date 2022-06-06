import { Stack, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { useOutletContext } from 'react-router-dom';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Channel } from '../../api/generated';
import MessageContent from './MessageContent';
import MessageInput from './MessageInput';
import { CHAT_MESSAGE_CONTENT_HEIGHT, EVENT } from '../config/constants';
import { SocketContext } from '../../contexts/SocketContext';

type Context = {
  channel: Channel | null;
};

const channelIcon = (isProtected: boolean) => {
  if (isProtected) {
    return <LockIcon />;
  }
  return <TagIcon />;
};

const MessageList = () => {
  const { channel } = useOutletContext<Context>();
  const { client } = useContext(SocketContext);
  const [messages, setMessages] = useState<any[]>([]);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    client.channels.on(EVENT.JOIN_CHANNEL_FROM_SERVER, (data: any) => {
      setMessages(data.messages);
    });
    client.channels.on(EVENT.SEND_MESSAGE_FROM_SERVER, (data: any) => {
      setMessages((prev) => [...prev, data]);
    });
    client.channels.emit(EVENT.JOIN_CHANNEL, {
      channelID: channel?.id,
    });
    return () => {
      client.channels.off(EVENT.JOIN_CHANNEL_FROM_SERVER);
      client.channels.off(EVENT.SEND_MESSAGE_FROM_SERVER);
      client.channels.emit(EVENT.LEAVE_CHANNEL, {
        channelID: channel?.id,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  useLayoutEffect(() => {
    scrollBottomRef?.current?.scrollIntoView();
  }, [messages]);

  return (
    <Stack width={880}>
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
        {channel &&
          messages.map((message) => (
            <MessageContent
              key={message.id}
              user={message.user}
              text={message.text}
              createdAt={message.createdAt}
            />
          ))}
        <div ref={scrollBottomRef} />
      </Stack>
      <MessageInput />
    </Stack>
  );
};

export default MessageList;
