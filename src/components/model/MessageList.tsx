import { Stack, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Channel } from '../../api/generated';
import MessageContent from './MessageContent';
import MessageInput from './MessageInput';
import { CHAT_MESSAGE_CONTENT_HEIGHT } from '../config/constants';
import useChannel from '../../api/websocket/useChannel';
import useMessage, { Message } from '../../api/websocket/useMessage';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const { joinChannel, leaveChannel } = useChannel();
  const {
    receiveMessage,
    receiveAllMessage,
    unsubscribeReceiveMessage,
    unsubscribeReceiveAllMessage,
  } = useMessage();

  useEffect(() => {
    receiveAllMessage((data: { messages: Message[] }) => {
      setMessages(data.messages);
    });
    receiveMessage((data: { message: Message }) => {
      // TODO sort by created_at
      setMessages((prev) => [...prev, data.message]);
    });
    joinChannel(channel!.id!);

    return () => {
      unsubscribeReceiveAllMessage();
      unsubscribeReceiveMessage();
      leaveChannel(channel!.id!);
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
