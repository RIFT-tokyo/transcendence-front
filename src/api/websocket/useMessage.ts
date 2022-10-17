import { useCallback, useContext } from 'react';
import { EVENT } from './common';
import { SocketContext } from '../../contexts/SocketContext';

export interface Message {
  id: number;
  text: string;
  createdAt: Date;
  user: {
    id: number;
    username: string;
    profile_image: string;
    display_name: string;
  };
}

const useMessage = () => {
  const { client } = useContext(SocketContext);

  const sendMessage = useCallback(
    (text: string, userID: number, channelID: number) => {
      if (client) {
        client.channels.emit(EVENT.MESSAGE_SEND, {
          text,
          userID,
          channelID,
        });
      }
    },
    [client],
  );

  const sendPrivateMessage = useCallback(
    (text: string, fromUserID: number, toUserID: number) => {
      if (client) {
        client.pms.emit(EVENT.PRIVATE_MESSAGE_SEND, {
          text,
          fromUserID,
          toUserID,
        });
      }
    },
    [client],
  );

  const receiveMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (client) {
        client.channels.on(EVENT.MESSAGE_RECEIVE, callback);
      }
    },
    [client],
  );

  const unsubscribeReceiveMessage = useCallback(() => {
    if (client) {
      client.channels.off(EVENT.MESSAGE_RECEIVE);
    }
  }, [client]);

  const receivePrivateMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (client) {
        client.pms.on(EVENT.PRIVATE_MESSAGE_RECEIVE, callback);
      }
    },
    [client],
  );

  const unsubscribeReceivePrivateMessage = useCallback(() => {
    if (client) {
      client.pms.off(EVENT.PRIVATE_MESSAGE_RECEIVE);
    }
  }, [client]);

  const receiveAllMessage = useCallback(
    (callback: (messages: Message[]) => void) => {
      if (client) {
        client.channels.on(EVENT.MESSAGE_RECEIVE_ALL, callback);
      }
    },
    [client],
  );

  const unsubscribeReceiveAllMessage = useCallback(() => {
    if (client) {
      client.channels.off(EVENT.MESSAGE_RECEIVE_ALL);
    }
  }, [client]);

  const receiveAllPrivateMessage = useCallback(
    (callback: (messages: Message[]) => void) => {
      if (client) {
        client.pms.on(EVENT.PRIVATE_MESSAGE_RECEIVE_ALL, callback);
      }
    },
    [client],
  );

  const unsubscribeReceiveAllPrivateMessage = useCallback(() => {
    if (client) {
      client.pms.off(EVENT.PRIVATE_MESSAGE_RECEIVE_ALL);
    }
  }, [client]);

  return {
    sendMessage,
    sendPrivateMessage,
    receiveMessage,
    unsubscribeReceiveMessage,
    receivePrivateMessage,
    unsubscribeReceivePrivateMessage,
    receiveAllMessage,
    unsubscribeReceiveAllMessage,
    receiveAllPrivateMessage,
    unsubscribeReceiveAllPrivateMessage,
  };
};

export default useMessage;
