import { useCallback, useContext } from 'react';
import { EVENT } from '../components/config/constants';
import { SocketContext } from '../contexts/SocketContext';

const useUserStatus = () => {
  const { client } = useContext(SocketContext);
  const emitUserStatus = useCallback(
    (status: string, userID: number | undefined) => {
      if (client) {
        client.users.emit(EVENT.USER_STATUS, {
          status,
          userID,
        });
      }
    },
    [client],
  );

  return { emitUserStatus };
};

export default useUserStatus;
