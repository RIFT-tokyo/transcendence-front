import { Box, Container } from '@mui/material';
import { useContext, useEffect, useReducer } from 'react';
import { UserStatusEnum } from '../../api/generated';
import useUserStatus from '../../api/websocket/useUserStatus';
import { AuthContext } from '../../contexts/AuthContext';
import GameCanvas from '../game/GameCanvas';
import Navigation from '../game/Navigation';
import { reducer } from '../game/types/reducer';

const Pong = () => {
  const { authUser } = useContext(AuthContext);
  const { setUserStatus } = useUserStatus();

  const [state, dispatch] = useReducer(reducer, {
    gameStatus: 'entrance',
    roomId: '',
    hostPlayer: null,
    guestPlayer: null,
    hostPoints: 0,
    guestPoints: 0,
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
          <GameCanvas context={state} dispatch={dispatch} />
        </Box>
      </Box>
    </Container>
  );
};

export default Pong;
