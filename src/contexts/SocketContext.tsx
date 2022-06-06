import React, { FC, useMemo } from 'react';
import socketIOclient from 'socket.io-client';
import {
  EVENT,
  SOCKET_CHANNELS,
  SOCKET_USERS,
} from '../components/config/constants';

export const SocketContext = React.createContext<any>(null);

export const SocketProvider: FC = ({ children }) => {
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

    indexSocketClient.on(EVENT.PONG, () => {});
    setClient({
      index: indexSocketClient,
      users: usersSocketClient,
      channels: channelsSocketClient,
    });
  };

  const disconnect = () => {
    client.index.disconnect();
    client.users.disconnect();
    client.channels.disconnect();
    setClient(null);
  };

  const memo = useMemo(() => ({ client, connect, disconnect }), [client]);

  return (
    <SocketContext.Provider value={memo}>{children}</SocketContext.Provider>
  );
};
