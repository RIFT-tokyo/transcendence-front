import { Box, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Dispatch } from 'react';
import { Actions, GameState } from './types/reducer';
import HostGame from './navigation/HostGame';
import JoinGame from './navigation/JoinGame';
import Waiting from './navigation/Waiting';
import FriendMatch from './navigation/FriendMatch';
import DisplayPoints from './navigation/DisplayPoints';
import DisplayResult from './navigation/DisplayResult';
import Entrance from './navigation/Entrance';
import WatchGame from './navigation/WatchGame';
import { CONTENT_HEIGHT } from '../config/constants';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

const Navigation = ({ context, dispatch }: Props) => (
  <Box
    component="div"
    maxHeight={CONTENT_HEIGHT}
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
                onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'play' })}
              >
                PONG
              </Typography>
            </Grid>
            {context.gameStatus === 'entrance' && (
              <Entrance dispatch={dispatch} />
            )}
            {context.gameStatus === 'friend_match' && (
              <FriendMatch context={context} dispatch={dispatch} />
            )}
            {context.gameStatus === 'watch_match' && (
              <WatchGame dispatch={dispatch} />
            )}
            {context.gameStatus === 'host' && (
              <HostGame context={context} dispatch={dispatch} />
            )}
            {context.gameStatus === 'join' && (
              <JoinGame context={context} dispatch={dispatch} />
            )}
            {context.gameStatus === 'waiting' && (
              <Waiting context={context} dispatch={dispatch} />
            )}
          </Grid>
        )}
      {context.gameStatus === 'play' && (
        <DisplayPoints context={context} dispatch={dispatch} />
      )}
      {context.gameStatus === 'watch' && (
        <DisplayPoints context={context} dispatch={dispatch} />
      )}
      {context.gameStatus === 'end' && (
        <DisplayResult context={context} dispatch={dispatch} />
      )}
    </Box>
  </Box>
);

export default Navigation;
