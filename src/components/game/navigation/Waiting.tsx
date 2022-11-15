import { Grid, Typography, CircularProgress, Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import ChatIcon from '@mui/icons-material/Chat';
import { Dispatch, useContext, useEffect } from 'react';
import { Actions, GameState } from '../types/reducer';
import usePong from '../../../api/websocket/usePong';
import { Match } from '../../../api/generated/api';
import { AuthContext } from '../../../contexts/AuthContext';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}
const Waiting = ({ context, dispatch }: Props) => {
  const { readyMatch } = usePong();
  const { authUser } = useContext(AuthContext);

  const callback = (match: Match) => {
    dispatch({ type: 'SET_HOST_PLAYER', payload: match.host_player ?? null });
    dispatch({ type: 'SET_GUEST_PLAYER', payload: match.guest_player ?? null });
    dispatch({ type: 'SET_GAME_STATUS', payload: 'play' });
  };

  useEffect(() => {
    readyMatch(context.roomId, callback);
    dispatch({ type: 'SET_IS_HOST', payload: context.hostPlayer?.id === authUser?.id });
  }, []);

  return (
    <Grid container item xs={12} spacing={4} marginY={5}>
      <Grid
        container
        item
        xs={12}
        spacing={1}
        alignItems="center"
        display="flex"
        direction="column"
      >
        {context.roomId && (
          <Typography variant="h4" color={blueGrey[100]}>
            Room ID: {context.roomId}
          </Typography>
        )}
        <Typography variant="h4" color={blueGrey[100]}>
          Waiting for other player to join
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={1}
        alignItems="center"
        display="flex"
        direction="column"
      >
        <CircularProgress sx={{ color: blueGrey[100] }} />
      </Grid>
      {context.roomId && (
        <>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              sx={{
                color: blueGrey[100],
              }}
              startIcon={<ChatIcon />}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Invite by chat
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={3} />
        </>
      )}
      <Grid item xs={4} />
      <Grid item xs={4}>
        <Button
          fullWidth
          size="small"
          sx={{
            color: blueGrey[100],
          }}
          onClick={() =>
            dispatch({ type: 'SET_GAME_STATUS', payload: 'entrance' })
          }
        >
          Back to Top
        </Button>
      </Grid>
      <Grid item xs={4} />
    </Grid>
  );
};
export default Waiting;
