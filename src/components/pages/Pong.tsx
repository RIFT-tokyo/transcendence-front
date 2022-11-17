import { Box, Container } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Canvas } from '@react-three/fiber';
import { useContext, useEffect, useReducer, useState } from 'react';
import { UserStatusEnum } from '../../api/generated';
import usePong from '../../api/websocket/usePong';
import useUserStatus from '../../api/websocket/useUserStatus';
import { AuthContext } from '../../contexts/AuthContext';
import { GAME_HEIGHT } from '../config/constants';
import GameCanvas from '../game/GameCanvas';
import Navigation from '../game/Navigation';
import { GameState, reducer, Vector } from '../game/types/reducer';

const Pong = () => {
  const { authUser } = useContext(AuthContext);
  const { setUserStatus } = useUserStatus();
  const [tick, setTick] = useState(false);
  const { sendMyPosition, subscribePositions, unsubscribePositions } =
    usePong();

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

  const handlePositions = (positions: {
    host: Vector;
    guest: Vector;
    ball: Vector;
  }) => {
    if (state.isHost) {
      dispatch({ type: 'SET_GUEST_POSITION', payload: positions.guest });
    } else {
      dispatch({ type: 'SET_HOST_POSITION', payload: positions.host });
    }
    dispatch({ type: 'SET_BALL_POSITION', payload: positions.ball });
  };

  useEffect(() => {
    if (authUser) setUserStatus(UserStatusEnum.Game, authUser.id!);
    return () => {
      if (authUser) setUserStatus(UserStatusEnum.Online, authUser.id!);
    };
  }, [setUserStatus, authUser]);

  useEffect(() => {
    if (state.gameStatus === 'play' && tick === true) {
      sendMyPosition(
        state.roomId,
        state.isHost ? state.hostPosition : state.guestPosition,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, tick]);

  useEffect(() => {
    if (state.gameStatus === 'play') {
      subscribePositions(handlePositions);
    } else if (state.gameStatus === 'end') {
      unsubscribePositions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus]);

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
            <GameCanvas
              context={state}
              dispatch={dispatch}
              tick={tick}
              setTick={setTick}
            />
          </Canvas>
        </Box>
      </Box>
    </Container>
  );
};

export default Pong;
