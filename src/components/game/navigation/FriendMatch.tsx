import { Grid, Button, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Dispatch } from 'react';
import { Actions, GameState } from '../types/reducer';
import BackToTop from './BackToTop';

interface Props {
  context: GameState
  dispatch: Dispatch<Actions>;
}

const FriendMatch = ({ context, dispatch }: Props) => (
  <Grid container item xs={12} marginY={5}>
    <Grid item xs={3} />
    <Grid container item xs={6} spacing={2}>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          sx={{
            color: blueGrey[100],
          }}
          onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'host' })}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            create room
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          sx={{
            color: blueGrey[100],
          }}
          onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'join' })}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            join room
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <BackToTop context={context} dispatch={dispatch} />
      </Grid>
    </Grid>
  </Grid>
);

export default FriendMatch;
