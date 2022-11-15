import { Box, Container } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Canvas } from '@react-three/fiber';
import { useContext, useEffect, useReducer } from 'react';
import { UserStatusEnum } from '../../api/generated';
import useUserStatus from '../../api/websocket/useUserStatus';
import { AuthContext } from '../../contexts/AuthContext';
import { GAME_HEIGHT } from '../config/constants';
import GameCanvas from '../game/GameCanvas';
import Navigation from '../game/Navigation';
import { GameState, reducer } from '../game/types/reducer';

const Pong = () => {
  const { authUser } = useContext(AuthContext);
  const { setUserStatus } = useUserStatus();

  const [state, dispatch] = useReducer(reducer, {
    gameStatus: 'entrance',
    isHost: true,
    roomId: '',
    hostPlayer: null,
    guestPlayer: null,
    hostPoints: 0,
    guestPoints: 0,
    hostPosition: [0, 0, 9.5],
    guestPosition: [0, 0, -9.5],
    ballPosition: [0, -0.1, 0],
  });

  useEffect(() => {
    if (authUser) setUserStatus(UserStatusEnum.Game, authUser.id!);
    return () => {
      if (authUser) setUserStatus(UserStatusEnum.Online, authUser.id!);
    };
  }, [setUserStatus, authUser]);

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
          <Navigation context={state} dispatch={dispatch} />
        </Box>
        <Box component="div">
          <Canvas
            shadows
            style={{
              height: GAME_HEIGHT,
              backgroundColor: blueGrey[900],
            }}
          >
            <GameCanvas context={state} dispatch={dispatch} />
          </Canvas>
        </Box>
      </Box>
    </Container>
  );
};

export default Pong;
