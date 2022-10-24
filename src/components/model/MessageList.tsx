import { Stack, Typography } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { useOutletContext } from 'react-router-dom';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Channel, User } from '../../api/generated';
import MessageContent from './MessageContent';
import MessageInput from './MessageInput';
import { CHAT_MESSAGE_CONTENT_HEIGHT } from '../config/constants';
import useChannel from '../../api/websocket/useChannel';
import useMessage, { Message } from '../../api/websocket/useMessage';
import { AuthContext } from '../../contexts/AuthContext';
import UserAvatar from './UserAvatar';

type Context = {
  channel: Channel | null;
  toUser: User | null;
};

const chatIcon = (toUser: User | null, isProtected: boolean) => {
  if (toUser) {
    return <UserAvatar user={toUser} size={20} />
  }
  if (isProtected) {
    return <LockIcon />;
  }
  return <TagIcon />;
};

const MessageList = () => {
  const { channel, toUser } = useOutletContext<Context>();
  const { authUser } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const { joinChannel, leaveChannel, joinPm, leavePm } = useChannel();
  const {
    receiveMessage,
    receiveAllMessage,
    unsubscribeReceiveMessage,
    unsubscribeReceiveAllMessage,
    receivePrivateMessage,
    receiveAllPrivateMessage,
    unsubscribeReceivePrivateMessage,
    unsubscribeReceiveAllPrivateMessage
  } = useMessage();

  useEffect(() => {
    setMessages([]);
    if (channel) {
      console.log('channel???');
      receiveAllMessage((receivedMessages: Message[]) => {
        setMessages(receivedMessages);
      });
      receiveMessage((message: Message) => {
        setMessages((prev) =>
          [...prev, message].sort(
            (a, b) => Number(a.createdAt) - Number(b.createdAt),
          ),
        );
      });
      joinChannel(channel.id!);
    }
    if (toUser) {
      console.log('PM???');
      receiveAllPrivateMessage((receivedMessages: Message[]) => {
        setMessages(receivedMessages);
      });
      receivePrivateMessage((message: Message) => {
        setMessages((prev) =>
          [...prev, message].sort(
            (a, b) => Number(a.createdAt) - Number(b.createdAt),
          ),
        );
      });
      joinPm(authUser!.id!, toUser.id!);
    }

    return () => {
      if (channel) {
        unsubscribeReceiveAllMessage();
        unsubscribeReceiveMessage();
        leaveChannel(channel.id!);
      }
      if (toUser) {
        unsubscribeReceiveAllPrivateMessage();
        unsubscribeReceivePrivateMessage();
        leavePm(authUser!.id!, toUser.id!);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, toUser]);

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
        {chatIcon(toUser, channel?.is_protected ?? false)}
        <Typography sx={{ fontWeight: 'bold' }} variant="h5">
          {toUser ? toUser.username : channel?.name}
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
        {toUser &&
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
