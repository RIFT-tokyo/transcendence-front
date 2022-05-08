import { Box, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameContext } from './types/gameStatus';
import HostGame from './navigation/HostGame';
import JoinGame from './navigation/JoinGame';
import Waiting from './navigation/Waiting';
import FriendMatch from './navigation/FriendMatch';
import DisplayPoints from './navigation/DisplayPoints';
import DisplayResult from './navigation/DisplayResult';
import Entrance from './navigation/Entrance';
import WatchGame from './navigation/WatchGame';

interface Props {
  context: GameContext;
  // eslint-disable-next-line no-unused-vars
  setContext: (context: GameContext) => void;
}

const Navigation = ({ context, setContext }: Props) => (
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
      {context.gameStatus !== 'play' &&
        context.gameStatus !== 'end' &&
        context.gameStatus !== 'watch' && (
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
                onClick={() => setContext({ ...context, gameStatus: 'play' })}
              >
                PONG
              </Typography>
            </Grid>
            {context.gameStatus === 'entrance' && (
              <Entrance context={context} setContext={setContext} />
            )}
            {context.gameStatus === 'friend_match' && (
              <FriendMatch context={context} setContext={setContext} />
            )}
            {context.gameStatus === 'watch_match' && (
              <WatchGame context={context} setContext={setContext} />
            )}
            {context.gameStatus === 'host' && (
              <HostGame context={context} setContext={setContext} />
            )}
            {context.gameStatus === 'join' && (
              <JoinGame context={context} setContext={setContext} />
            )}
            {context.gameStatus === 'waiting' && (
              <Waiting context={context} setContext={setContext} />
            )}
          </Grid>
        )}
      {context.gameStatus === 'play' && (
        <DisplayPoints context={context} setContext={setContext} />
      )}
      {context.gameStatus === 'watch' && (
        <DisplayPoints context={context} setContext={setContext} />
      )}
      {context.gameStatus === 'end' && (
        <DisplayResult context={context} setContext={setContext} />
      )}
    </Box>
  </Box>
);

export default Navigation;
