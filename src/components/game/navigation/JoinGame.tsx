import { Button, Grid, TextField, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Dispatch } from 'react';
import { Actions, GameState } from '../types/reducer';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

const JoinGame = ({ context, dispatch }: Props) => (
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
          onChange={(e) => dispatch({ type: 'SET_ROOM_ID', payload: e.target.value })}
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
          onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'waiting' })}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            join
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={1} />
    </Grid>
    <Grid item xs={4} />
    <Grid item xs={4}>
      <Button
        fullWidth
        size="small"
        sx={{
          color: blueGrey[100],
        }}
        onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'entrance' })}
      >
        Back to Top
      </Button>
    </Grid>
    <Grid item xs={4} />
  </Grid>
);

export default JoinGame;
