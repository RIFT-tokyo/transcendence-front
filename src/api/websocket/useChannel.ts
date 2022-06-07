import { useCallback, useContext } from 'react';
import { EVENT } from '../../components/config/constants';
import { SocketContext } from '../../contexts/SocketContext';

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

  return { joinChannel, leaveChannel };
};

export default useChannel;
