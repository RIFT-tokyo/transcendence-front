import React, { FC, useMemo } from 'react';
import socketIOclient from 'socket.io-client';
import { EVENT, SOCKET_USERS } from '../components/config/constants';

export const SocketContext = React.createContext<any>(null);

export const SocketProvider: FC = ({ children }) => {
  const [client, setClient] = React.useState<any>(null);

  const connect = (id: number) => {
    // namespace: /
    const indexSocketClient = socketIOclient(process.env.REACT_APP_SOCKET_URL!, {
      auth: { userID: id },
    });
    // namespace: /users
    const usersSocketClient = socketIOclient(
      process.env.REACT_APP_SOCKET_URL! + SOCKET_USERS,
      {
        auth: { userID: id },
      },
    );

    indexSocketClient.on(EVENT.PONG, () => {});
    setClient({ index: indexSocketClient, users: usersSocketClient });
  };

  const memo = useMemo(() => ({ client, connect }), [client]);

  return (
    <SocketContext.Provider value={memo}>{children}</SocketContext.Provider>
  );
};
