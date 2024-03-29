import { useContext, useCallback } from 'react';
import { GameStatus, Vector } from '../../components/game/types/reducer';
import { SocketContext } from '../../contexts/SocketContext';
import { Match } from '../generated/api';
import { EVENT } from './common';

export type LeaveStatus = 'waiting' | 'play' | 'back_to_top';

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

  const watchMatch = useCallback(
    (
      roomId: string,
      callback: (response: { isSucceeded: boolean, match: Match }) => void,
    ) => {
      if (client) {
        client.pong.once(EVENT.MATCH_WATCH, callback);
        client.pong.emit(EVENT.MATCH_WATCH, { roomId });
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
    (roomId: string, position: Vector, isHost: boolean) => {
      if (client) {
        client.pong.emit(EVENT.PONG_MY_POSITION, { roomId, position, isHost });
      }
    },
    [client],
  );

  const subscribePlayerPosition = useCallback(
    (callback: (payload: { isHost: boolean; position: Vector }) => void) => {
      if (client) {
        client.pong.on(EVENT.PONG_PLAYER_POSITION, callback);
      }
    },
    [client],
  );

  const unsubscribePlayerPosition = useCallback(() => {
    if (client) {
      client.pong.off(EVENT.PONG_PLAYER_POSITION);
    }
  }, [client]);

  const subscribeBallPosition = useCallback(
    (callback: (position: Vector) => void) => {
      if (client) {
        client.pong.on(EVENT.PONG_BALL_POSITION, callback);
      }
    },
    [client],
  );

  const unsubscribeBallPosition = useCallback(() => {
    if (client) {
      client.pong.off(EVENT.PONG_BALL_POSITION);
    }
  }, [client]);

  const leaveRoom = useCallback(
    (roomId: string, status: LeaveStatus) => {
      if (client) {
        client.pong.emit(EVENT.PONG_LEAVE, { roomId, status });
      }
    },
    [client],
  );

  return {
    createMatch,
    joinMatch,
    autoMatch,
    watchMatch,
    readyMatch,
    gainPoint,
    subscribeMatchStatus,
    subscribeMatchFinish,
    sendMyPosition,
    subscribePlayerPosition,
    unsubscribePlayerPosition,
    subscribeBallPosition,
    unsubscribeBallPosition,
    leaveRoom,
  };
};

export default usePong;
