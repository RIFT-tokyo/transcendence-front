import React, { FC, useMemo } from 'react';
import socketIOclient from 'socket.io-client';

export const SocketContext = React.createContext<any>(null);

export const ContextProvider: FC = ({ children }) => {
  const [client, setClient] = React.useState<any>(null);

  const connect = (id: number) => {
    const sclient = socketIOclient(process.env.REACT_APP_SOCKET_URL!, {
      auth: { userID: id },
    });

    sclient.on('pong', () => {
      console.log('pong');
    });
    sclient.emit('userStatus', { status: 'online', userID: id });

    setClient(sclient);
  };

  const memo = useMemo(() => ({ client, connect }), [client]);

  return (
    <SocketContext.Provider value={memo}>{children}</SocketContext.Provider>
  );
};
