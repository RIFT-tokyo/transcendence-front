import { useCallback, useContext } from 'react';
import { EVENT } from '../../components/config/constants';
import { SocketContext } from '../../contexts/SocketContext';

const usePing = () => {
  const { client } = useContext(SocketContext);
  const publishPing = useCallback(() => {
    if (client) {
      client.index.emit(EVENT.PING);
    }
  }, [client]);

  return { publishPing };
};

export default usePing;
