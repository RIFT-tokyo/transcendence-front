import { useCallback, useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { EVENT } from './common';

const useChannel = () => {
  const { client } = useContext(SocketContext);

  const joinChannel = useCallback(
    (channelID: number) => {
      if (client) {
        client.channels.emit(EVENT.CHANNEL_JOIN, { channelID });
      }
    },
    [client],
  );

  const leaveChannel = useCallback(
    (channelID: number) => {
      if (client) {
        client.channels.emit(EVENT.CHANNEL_LEAVE, { channelID });
      }
    },
    [client],
  );

  const joinPm = useCallback(
    (fromUserID: number, toUserID: number) => {
      if (client) {
        client.pms.emit(EVENT.PM_JOIN, { fromUserID, toUserID });
      }
    },
    [client],
  );

  const leavePm = useCallback(
    (fromUserID: number, toUserID: number) => {
      if (client) {
        client.pms.emit(EVENT.PM_LEAVE, { fromUserID, toUserID });
      }
    },
    [client],
  );

  return { joinChannel, leaveChannel, joinPm, leavePm };
};

export default useChannel;
