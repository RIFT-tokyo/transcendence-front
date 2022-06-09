import { useCallback, useContext } from 'react';
import { UserStatusEnum } from '../generated';
import { EVENT, WebSocketCallback } from './common';
import { SocketContext } from '../../contexts/SocketContext';

type ReceiveUserStatusPayload = {
  status: UserStatusEnum;
  userID: number;
};

const useUserStatus = () => {
  const { client } = useContext(SocketContext);

  const setUserStatus = useCallback(
    (status: UserStatusEnum, userID: number) => {
      if (client) {
        client.users.emit(EVENT.USER_STATUS_SET, { status, userID });
      }
    },
    [client],
  );

  const receiveUserStatus = useCallback(
    (callback: WebSocketCallback<ReceiveUserStatusPayload>) => {
      if (client) {
        client.users.on(EVENT.USER_STATUS_RECEIVE, callback);
      }
    },
    [client],
  );

  const unsubscribeReceiveUserStatus = useCallback(() => {
    if (client) {
      client.users.off(EVENT.USER_STATUS_RECEIVE);
    }
  }, [client]);

  return { setUserStatus, receiveUserStatus, unsubscribeReceiveUserStatus };
};

export default useUserStatus;
