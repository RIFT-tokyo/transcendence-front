import { useCallback, useContext } from 'react';
import { EVENT } from '../components/config/constants';
import { AuthContext } from '../contexts/AuthContext';
import { SocketContext } from '../contexts/SocketContext';

const useUserStatus = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);

  const emitUserStatus = useCallback(
    (status: string) => {
      if (client) {
        client.users.emit(EVENT.USER_STATUS, {
          status,
          id: authUser?.id,
        });
      }
    },
    [authUser?.id, client],
  );

  return { emitUserStatus };
};

export default useUserStatus;
