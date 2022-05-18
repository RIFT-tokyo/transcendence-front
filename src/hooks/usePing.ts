import { useContext, useEffect } from 'react';
import { EVENT } from '../components/config/constants';
import { SocketContext } from '../contexts/SocketContext';

const usePing = () => {
  const { client } = useContext(SocketContext);
  const emitPing = () => {
    if (client) {
      client.index.emit(EVENT.PING);
    }
  };

  return { emitPing };
};

export default usePing;
