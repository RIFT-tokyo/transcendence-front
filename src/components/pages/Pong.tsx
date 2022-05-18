import { Box, Container } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import usePing from '../../hooks/usePing';
import { EVENT } from '../config/constants';
import GameCanvas from '../game/GameCanvas';
import Navigation from '../game/Navigation';
import { GameContext } from '../game/types/gameStatus';

const Pong = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);
  const { emitPing } = usePing();

  const [context, setContext] = useState<GameContext>({
    gameStatus: 'entrance',
    roomId: '',
    hostPlayer: null,
    guestPlayer: null,
    hostPoints: 0,
    guestPoints: 0,
  });

  useEffect(() => {
    emitPing();
    if (client) {
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
  }, [authUser?.id, client]);

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
          <Navigation context={context} setContext={setContext} />
        </Box>
        <Box component="div">
          <GameCanvas context={context} setContext={setContext} />
        </Box>
      </Box>
    </Container>
  );
};

export default Pong;
