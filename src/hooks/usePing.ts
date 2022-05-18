import { useCallback, useContext } from 'react';
import { EVENT } from '../components/config/constants';
import { SocketContext } from '../contexts/SocketContext';

const usePing = () => {
  const { client } = useContext(SocketContext);
  const emitPing = useCallback(() => {
    if (client) {
      client.index.emit(EVENT.PING);
    }
  }, [client]);

  return { emitPing };
};

export default usePing;
