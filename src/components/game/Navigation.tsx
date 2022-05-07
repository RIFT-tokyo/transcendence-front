import { Box, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameStatus } from './types/gameStatus';
import HostGame from './navigation/HostGame';
import JoinGame from './navigation/JoinGame';
import Waiting from './navigation/Waiting';
import Welcome from './navigation/Welcome';
import DisplayPoints from './navigation/DisplayPoints';
import DisplayResult from './navigation/DisplayResult';
import { User } from '../../api/generated';

interface Props {
  gameStatus: GameStatus;
  // eslint-disable-next-line no-unused-vars
  setGameStatus: (gameStatus: GameStatus) => void;
  hostPlayer: User | null;
  guestPlayer: User | null;
  hostPoints: number;
  guestPoints: number;
}

const Navigation = ({
  gameStatus,
  setGameStatus,
  hostPlayer,
  guestPlayer,
  hostPoints,
  guestPoints,
}: Props) => (
  <Box
    component="div"
    maxHeight="calc(100vh - 220px)"
    padding={2}
    sx={{ overflow: 'auto' }}
  >
    <Box
      margin="auto"
      component="div"
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="sm"
    >
      {gameStatus !== 'play' && gameStatus !== 'end' && (
        <Grid container spacing={10}>
          <Grid
            item
            container
            xs={12}
            marginY={10}
            alignItems="center"
            display="flex"
            direction="column"
          >
            <Typography
              variant="h1"
              color={blueGrey[200]}
              sx={{
                fontFamily: 'Zen Tokyo Zoo',
              }}
              onClick={() => setGameStatus('play')}
            >
              PONG
            </Typography>
          </Grid>
          {gameStatus === 'welcome' && <Welcome setStatus={setGameStatus} />}
          {gameStatus === 'host' && <HostGame setStatus={setGameStatus} />}
          {gameStatus === 'join' && <JoinGame setStatus={setGameStatus} />}
          {gameStatus === 'waiting' && <Waiting setStatus={setGameStatus} />}
        </Grid>
      )}
      {gameStatus === 'play' && (
        <DisplayPoints
          setStatus={setGameStatus}
          hostPlayer={hostPlayer!}
          guestPlayer={guestPlayer!}
          hostPoints={hostPoints}
          guestPoints={guestPoints}
        />
      )}
      {gameStatus === 'end' && <DisplayResult setStatus={setGameStatus} />}
    </Box>
  </Box>
);

export default Navigation;
