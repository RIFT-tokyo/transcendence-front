import { Button, Grid, TextField, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import { Dispatch } from 'react';
import { Match } from '../../../api/generated';
import usePong from '../../../api/websocket/usePong';
import { Actions, GameState } from '../types/reducer';
import BackToTop from './BackToTop';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

const WatchGame = ({ context, dispatch }: Props) => {
  const { watchMatch } = usePong();
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    const callback = (response: { isSucceeded: boolean; match: Match }) => {
      if (response.isSucceeded) {
        dispatch({
          type: 'SET_HOST_PLAYER',
          payload: response.match.host_player ?? null,
        });
        dispatch({
          type: 'SET_GUEST_PLAYER',
          payload: response.match.guest_player ?? null,
        });
        dispatch({ type: 'SET_GAME_STATUS', payload: 'watch' });
      } else {
        enqueueSnackbar('Failed to watch room', { variant: 'error' });
      }
    };
    watchMatch(context.roomId, callback);
  };

  return (
    <Grid container item xs={12} spacing={4} marginY={5}>
      <Grid container item xs={12} spacing={1} alignItems="center">
        <Grid item xs={1} />
        <Grid item xs={7}>
          <TextField
            value={context.roomId}
            fullWidth
            sx={{
              borderRadius: 1,
              backgroundColor: blueGrey[100],
            }}
            onChange={(e) =>
              dispatch({ type: 'SET_ROOM_ID', payload: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            sx={{
              color: blueGrey[100],
            }}
            onClick={handleClick}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              watch
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={1} />
      </Grid>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <BackToTop context={context} dispatch={dispatch} />
      </Grid>
      <Grid item xs={4} />
    </Grid>
  );
};

export default WatchGame;
