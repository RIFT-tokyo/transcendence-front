import { useContext, useCallback } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { EVENT } from './common';

const usePong = () => {
  const { client } = useContext(SocketContext);

  const createMatch = useCallback(
    (
      roomId: string,
      callback: (response: { isSucceeded: boolean }) => void,
    ) => {
      if (client) {
        client.pong.once(EVENT.MATCH_CREATE, callback);
        client.pong.emit(EVENT.MATCH_CREATE, { roomId });
      }
    },
    [client],
  );

  const joinMatch = useCallback(
    (roomId: string, callback: (response: { isSucceeded: boolean}) => void) => {
      if (client) {
        client.pong.once(EVENT.MATCH_JOIN, callback);
        client.pong.emit(EVENT.MATCH_JOIN, { roomId });
      }
    },
    [client],
  );

  const readyMatch = useCallback(
    (roomId: string, callback: (response: { isSucceeded: boolean }) => void) => {
      if (client) {
        client.pong.once(EVENT.MATCH_START, callback);
        client.pong.emit(EVENT.MATCH_READY, { roomId });
      }
    },
    [client],
  );

  return { createMatch, joinMatch, readyMatch };
};

export default usePong;
