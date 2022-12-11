import { Box, Container } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Canvas } from '@react-three/fiber';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserStatusEnum } from '../../api/generated';
import usePong, { LeaveStatus } from '../../api/websocket/usePong';
import useUserStatus from '../../api/websocket/useUserStatus';
import { AuthContext } from '../../contexts/AuthContext';
import { GAME_HEIGHT } from '../config/constants';
import GameCanvas from '../game/GameCanvas';
import Navigation from '../game/Navigation';
import { GameState, reducer, Vector } from '../game/types/reducer';

// ゲーム参加link
// /pong?roomId=sadf31
// ゲーム観戦link
// /pong?watch&roomId=sadf31
// /pong?watch&userId=3

const Pong = () => {
  const { authUser } = useContext(AuthContext);
  const { setUserStatus } = useUserStatus();
  const [tick, setTick] = useState(false);
  const {
    sendMyPosition,
    subscribeEnemyPosition,
    unsubscribeEnemyPosition,
    subscribeBallPosition,
    unsubscribeBallPosition,
    leaveRoom,
    joinMatch,
  } = usePong();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const { enqueueSnackbar } = useSnackbar();

  const stateRef = useRef<GameState>();

  const handleEnemyPosition = (position: Vector) => {
    if (state.isHost) {
      dispatch({ type: 'SET_GUEST_POSITION', payload: position });
    } else {
      dispatch({ type: 'SET_HOST_POSITION', payload: position });
    }
  };

  const handleBallPosition = (position: Vector) => {
    dispatch({ type: 'SET_BALL_POSITION', payload: position });
  };

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
      subscribeEnemyPosition(handleEnemyPosition);
      subscribeBallPosition(handleBallPosition);
    } else if (state.gameStatus === 'end') {
      unsubscribeEnemyPosition();
      unsubscribeBallPosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameStatus]);

  useEffect(() => {
    if (searchParams.has('roomId')) {
      const roomId = searchParams.get('roomId');
      if (searchParams.has('watch')) {
        // watch
      } else {
        // join
        dispatch({ type: 'SET_ROOM_ID', payload: roomId! });
        const callback = (response: { isSucceeded: boolean }) => {
          if (response.isSucceeded) {
            dispatch({ type: 'SET_GAME_STATUS', payload: 'waiting' });
          } else {
            enqueueSnackbar('Failed to join room', { variant: 'error' });
          }
          searchParams.delete('roomId');
          setSearchParams(searchParams);
        };
        joinMatch(roomId!, callback);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinMatch]);

  useEffect(
    () => () => {
        unsubscribeEnemyPosition();
        unsubscribeBallPosition();
        if (stateRef.current?.roomId) {
          if (
            stateRef.current?.gameStatus === 'waiting' ||
            stateRef.current?.gameStatus === 'play'
          ) {
            leaveRoom(
              stateRef.current?.roomId,
              stateRef.current?.gameStatus as LeaveStatus,
            );
          }
        }
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
