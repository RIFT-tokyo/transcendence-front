import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';

const Pong = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    client.emit('ping');
	client.emit('userStatus', { status: 'game', userID: authUser?.id });
    return () => {
      client.emit('userStatus', { status: 'online', userID: authUser?.id });
    };
  }, []);

  return <Typography variant="h2">This page is for Pong</Typography>;
};

export default Pong;
