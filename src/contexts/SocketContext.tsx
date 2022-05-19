import React, { FC, useMemo } from 'react';
import socketIOclient from 'socket.io-client';
import { EVENT, SOCKET_USERS } from '../components/config/constants';

export const SocketContext = React.createContext<any>(null);

export const SocketProvider: FC = ({ children }) => {
  const [client, setClient] = React.useState<any>(null);

  const connect = (id: number) => {
    const indexSclient = socketIOclient(process.env.REACT_APP_SOCKET_URL!, {
      auth: { userID: id },
    });
    const usersSclient = socketIOclient(
      process.env.REACT_APP_SOCKET_URL! + SOCKET_USERS,
      {
        auth: { userID: id },
      },
    );

    indexSclient.on(EVENT.PONG, () => {});

    setClient({ index: indexSclient, users: usersSclient });
  };

  const memo = useMemo(() => ({ client, connect }), [client]);

  return (
    <SocketContext.Provider value={memo}>{children}</SocketContext.Provider>
  );
};
