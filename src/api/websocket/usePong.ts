import { useContext, useCallback } from 'react';
import { Vector } from '../../components/game/types/reducer';
import { SocketContext } from '../../contexts/SocketContext';
import { Match } from '../generated/api';
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
    (
      roomId: string,
      callback: (response: { isSucceeded: boolean }) => void,
    ) => {
      if (client) {
        client.pong.once(EVENT.MATCH_JOIN, callback);
        client.pong.emit(EVENT.MATCH_JOIN, { roomId });
      }
    },
    [client],
  );

  const autoMatch = useCallback(
    (
      callback: (response: { isSucceeded: boolean; roomId: string }) => void,
    ) => {
      if (client) {
        client.pong.once(EVENT.MATCH_AUTO, callback);
        client.pong.emit(EVENT.MATCH_AUTO, {});
      }
    },
    [client],
  );

  const readyMatch = useCallback(
    (roomId: string, callback: (match: Match) => void) => {
      if (client) {
        client.pong.once(EVENT.MATCH_START, callback);
        client.pong.emit(EVENT.MATCH_READY, { roomId });
      }
    },
    [client],
  );

  const gainPoint = useCallback(
    (roomId: string, userId: number) => {
      if (client) {
        client.pong.emit(EVENT.MATCH_GAIN_POINT, { roomId, userId });
      }
    },
    [client],
  );

  const subscribeMatchStatus = useCallback(
    (callback: (status: Match) => void) => {
      if (client) {
        client.pong.on(EVENT.MATCH_STATUS, callback);
      }
    },
    [client],
  );

  const subscribeMatchFinish = useCallback(
    (callback: () => void) => {
      if (client) {
        const callbackWrapper = (): void => {
          callback();
          client.pong.off(EVENT.MATCH_STATUS);
        };
        client.pong.once(EVENT.MATCH_FINISH, callbackWrapper);
      }
    },
    [client],
  );

  const sendMyPosition = useCallback(
    (roomId: string, position: Vector) => {
      if (client) {
        client.pong.emit(EVENT.PONG_MY_POSITION, { roomId, position });
      }
    },
    [client],
  );

  const subscribeEnemyPosition = useCallback(
    (callback: (position: Vector) => void) => {
      if (client) {
        client.pong.on(EVENT.PONG_ENEMY_POSITION, callback);
      }
    },
    [client],
  );

  const unsubscribeEnemyPosition = useCallback(() => {
    if (client) {
      client.pong.off(EVENT.PONG_ENEMY_POSITION);
    }
  }, [client]);

  return {
    createMatch,
    joinMatch,
    autoMatch,
    readyMatch,
    gainPoint,
    subscribeMatchStatus,
    subscribeMatchFinish,
    sendMyPosition,
    subscribeEnemyPosition,
    unsubscribeEnemyPosition,
  };
};

export default usePong;
