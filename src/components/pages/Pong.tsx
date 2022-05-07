import { Box, Container } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { User } from '../../api/generated';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import { EVENT } from '../config/constants';
import GameCanvas from '../game/GameCanvas';
import Navigation from '../game/Navigation';
import { GameStatus } from '../game/types/gameStatus';

const Pong = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);

  const [gameStatus, setGameStatus] = useState<GameStatus>('welcome');
  const [hostPlayer] = useState<User | null>(null);
  const [guestPlayer] = useState<User | null>(null);
  const [hostPoints] = useState<number>(0);
  const [guestPoints] = useState<number>(0);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return (
    <Container component="main" maxWidth="xl">
      <Box component="div" sx={{ paddingY: 2, position: 'relative' }}>
        <Box
          component="div"
          top={0}
          left={-24}
          width={1}
          zIndex={500}
          paddingX={3}
          paddingY={2}
          sx={{
            position: 'absolute',
          }}
        >
          <Navigation
            gameStatus={gameStatus}
            setGameStatus={setGameStatus}
            hostPlayer={hostPlayer}
            guestPlayer={guestPlayer}
            hostPoints={hostPoints}
            guestPoints={guestPoints}
          />
        </Box>
        <Box component="div">
          <GameCanvas />
        </Box>
      </Box>
    </Container>
  );
};

export default Pong;
