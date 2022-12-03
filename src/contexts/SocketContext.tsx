import React, { FC, useCallback, useMemo } from 'react';
import socketIOclient from 'socket.io-client';
import {
  SOCKET_CHANNELS,
  SOCKET_PMS,
  SOCKET_PONG,
  SOCKET_USERS,
} from '../components/config/constants';

export const SocketContext = React.createContext<any>(null);

export const SocketProvider: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [client, setClient] = React.useState<any>(null);

  const connect = (id: number) => {
    // namespace: /
    const indexSocketClient = socketIOclient(
      process.env.REACT_APP_SOCKET_URL!,
      {
        auth: { userID: id },
      },
    );
    // namespace: /users
    const usersSocketClient = socketIOclient(
      process.env.REACT_APP_SOCKET_URL! + SOCKET_USERS,
      {
        auth: { userID: id },
      },
    );
    // namespace: /channels
    const channelsSocketClient = socketIOclient(
      process.env.REACT_APP_SOCKET_URL! + SOCKET_CHANNELS,
      {
        auth: { userID: id },
      },
    );
    // namespace: /pms
    const pmsSocketClient = socketIOclient(
      process.env.REACT_APP_SOCKET_URL! + SOCKET_PMS,
      {
        auth: { userID: id },
      },
    );
    // namespace: /pong
    const pongSocketClient = socketIOclient(
      process.env.REACT_APP_SOCKET_URL! + SOCKET_PONG,
      {
        auth: { userID: id },
      }
    )

    setClient({
      index: indexSocketClient,
      users: usersSocketClient,
      channels: channelsSocketClient,
      pms: pmsSocketClient,
      pong: pongSocketClient,
    });
  };

  const disconnect = useCallback(() => {
    client.index.disconnect();
    client.users.disconnect();
    client.channels.disconnect();
    client.pms.disconnect();
    client.pong.disconnect();
    setClient(null);
  }, [client]);

  const memo = useMemo(() => ({ client, connect, disconnect }), [client, disconnect]);

  return (
    <SocketContext.Provider value={memo}>{children}</SocketContext.Provider>
  );
};
