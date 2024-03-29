import { Stack, Typography } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Channel, User } from '../../api/generated';
import MessageContent from './MessageContent';
import MessageInput from './MessageInput';
import { CHAT_MESSAGE_CONTENT_HEIGHT } from '../config/constants';
import useChannel from '../../api/websocket/useChannel';
import useMessage, { Message } from '../../api/websocket/useMessage';
import { AuthContext } from '../../contexts/AuthContext';

type Context = {
  channel: Channel | null;
  toUser: User | null;
  blockUserIds: number[];
};

const MessageList = () => {
  const { channel, toUser, blockUserIds } = useOutletContext<Context>();
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
    <>
      <Stack
        spacing={2}
        height={CHAT_MESSAGE_CONTENT_HEIGHT}
        sx={{ overflowY: 'auto' }}
      >
        {(channel || toUser) &&
          messages.filter((message) =>
             !blockUserIds.includes(message.user.id)
          ).map((message) => (
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
    </>
  );
};

export default MessageList;
