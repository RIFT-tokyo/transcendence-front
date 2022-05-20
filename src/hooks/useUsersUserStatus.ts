import { useCallback, useContext } from 'react';
import { UserStatusEnum } from '../api/generated';
import { EVENT } from '../components/config/constants';
import { AuthContext } from '../contexts/AuthContext';
import { SocketContext } from '../contexts/SocketContext';

const useUsersUserStatus = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);

  const publishUserStatus = useCallback(
    (status: UserStatusEnum) => {
      if (client) {
        client.users.emit(EVENT.USER_STATUS, {
          status,
          id: authUser?.id,
        });
      }
    },
    [authUser?.id, client],
  );

  const subscribeUserStatus = useCallback(
    (callback: (data: { status: string; userID: number }) => void) => {
      if (client) {
        client.users.on(EVENT.USER_STATUS, callback);
      }
    },
    [client],
  );

  const unsubscribeUserStatus = useCallback(
    (callback: (data: { status: string; userID: number }) => void) => {
      if (client) {
        client.users.off(EVENT.USER_STATUS, callback);
      }
    },
    [client],
  );

  return { publishUserStatus, subscribeUserStatus, unsubscribeUserStatus };
};

export default useUsersUserStatus;
