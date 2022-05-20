import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { UserStatusEnum } from '../../api/generated';
import usePing from '../../hooks/usePing';
import useUsersUserStatus from '../../hooks/useUsersUserStatus';
import GameCanvas from '../game/GameCanvas';
import Navigation from '../game/Navigation';
import { GameContext } from '../game/types/gameStatus';

const Pong = () => {
  const { publishPing } = usePing();
  const { publishUserStatus } = useUsersUserStatus();

  const [context, setContext] = useState<GameContext>({
    gameStatus: 'entrance',
    roomId: '',
    hostPlayer: null,
    guestPlayer: null,
    hostPoints: 0,
    guestPoints: 0,
  });

  useEffect(() => {
    publishPing();
    publishUserStatus(UserStatusEnum.Game);
    return () => {
      publishUserStatus(UserStatusEnum.Online);
    };
  }, [publishPing, publishUserStatus]);

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
