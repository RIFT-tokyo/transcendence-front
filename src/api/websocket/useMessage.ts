import { useCallback, useContext } from 'react';
import { EVENT, WebSocketCallback } from './common';
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

  const receiveMessage = useCallback(
    (callback: WebSocketCallback<Message>) => {
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

  const receiveAllMessage = useCallback(
    (callback: WebSocketCallback<Message[]>) => {
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

  return {
    sendMessage,
    receiveMessage,
    unsubscribeReceiveMessage,
    receiveAllMessage,
    unsubscribeReceiveAllMessage,
  };
};

export default useMessage;
