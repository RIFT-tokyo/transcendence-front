import { Grid, Typography } from '@mui/material';
import { blue, blueGrey, pink } from '@mui/material/colors';
import { Dispatch } from 'react';
import { Actions, GameState } from '../types/reducer';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

const DisplayPoints = ({ context, dispatch }: Props) => (
  <Grid container padding={4} spacing={2}>
    <Grid
      item
      container
      xs={4}
      marginTop={6}
      alignItems="right"
      direction="row-reverse"
    >
      <Typography variant="h4" color={blue[700]}>
        {context.hostPlayer?.display_name ?? context.hostPlayer?.username}
      </Typography>
    </Grid>
    <Grid
      item
      container
      xs={4}
      alignItems="center"
      display="flex"
      direction="column"
    >
      <Typography
        variant="h4"
        color={blueGrey[200]}
        sx={{
          fontFamily: 'Zen Tokyo Zoo',
        }}
        onClick={() => dispatch({ type: 'SET_GAME_STATUS', payload: 'end' })}
      >
        POINTS
      </Typography>
      <Typography variant="h2" color={blueGrey[200]}>
        {context.hostPoints} - {context.guestPoints}
      </Typography>
    </Grid>
    <Grid item container xs={4} marginTop={6} alignItems="left">
      <Typography variant="h4" color={pink[700]}>
        {context.guestPlayer?.display_name ?? context.guestPlayer?.username}
      </Typography>
    </Grid>
  </Grid>
);

export default DisplayPoints;
