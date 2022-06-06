import { useCallback, useContext } from 'react';
import { UserStatusEnum } from '../generated';
import { EVENT } from '../../components/config/constants';
import { SocketContext } from '../../contexts/SocketContext';
import { WebSocketCallback } from './common';

type UserStatusPayload = {
  status: UserStatusEnum;
  userID: number;
};

const useUsersUserStatus = () => {
  const { client } = useContext(SocketContext);

  const publishUserStatus = useCallback(
    ({ status, userID }: UserStatusPayload) => {
      if (client) {
        client.users.emit(EVENT.USER_STATUS, {
          status,
          userID,
        });
      }
    },
    [client],
  );

  const subscribeUserStatus = useCallback(
    (callback: WebSocketCallback<UserStatusPayload>) => {
      if (client) {
        client.users.on(EVENT.USER_STATUS, callback);
      }
    },
    [client],
  );

  const unsubscribeUserStatus = useCallback(() => {
    if (client) {
      client.users.off(EVENT.USER_STATUS);
    }
  }, [client]);

  return { publishUserStatus, subscribeUserStatus, unsubscribeUserStatus };
};

export default useUsersUserStatus;
