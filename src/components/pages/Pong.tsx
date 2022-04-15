import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';

const Pong = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (client) {
      client.emit('ping');
      client.emit('userStatus', { status: 'game', userID: authUser?.id });
    }
    return () => {
      if (client)
        client.emit('userStatus', { status: 'online', userID: authUser?.id });
    };
  }, [client]);

  return <Typography variant="h2">This page is for Pong</Typography>;
};

export default Pong;
