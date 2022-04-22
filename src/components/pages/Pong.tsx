import { Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import { EVENT } from '../config/constants';

const Pong = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (client) {
      client.index.emit(EVENT.PING);
      client.users.emit(EVENT.USER_STATUS, {
        status: 'game',
        userID: authUser?.id,
      });
    }
    return () => {
      if (client)
        client.users.emit(EVENT.USER_STATUS, {
          status: 'online',
          userID: authUser?.id,
        });
    };
  }, [client]);

  return <Typography variant="h2">This page is for Pong</Typography>;
};

export default Pong;
