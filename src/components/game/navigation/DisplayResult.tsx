import { Button, Grid, Typography } from '@mui/material';
import { blue, blueGrey, pink } from '@mui/material/colors';
import { Dispatch, useContext, useEffect, useState } from 'react';
import { Actions, GameState } from '../types/reducer';
import { AuthContext } from '../../../contexts/AuthContext';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

const DisplayPoints = ({ context, dispatch }: Props) => {
  const { authUser } = useContext(AuthContext);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const isHost = context.hostPlayer?.id === authUser?.id;
    const hostWin = context.hostPoints > context.guestPoints;
    if ((isHost && hostWin) || (!isHost && !hostWin)) {
      setResult('WIN');
    } else {
      setResult('LOSE');
    }
  }, []);

  return (
    <Grid container spacing={4}>
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
          variant="h2"
          color={blueGrey[200]}
          sx={{
            fontFamily: 'Zen Tokyo Zoo',
          }}
        >
          RESULT
        </Typography>
        <Typography variant="h1" color={blueGrey[200]}>
          {context.hostPoints} - {context.guestPoints}
        </Typography>
      </Grid>
      <Grid
        item
        container
        xs={12}
        alignItems="center"
        display="flex"
        direction="column"
      >
        <Typography
          variant="h1"
          color={result === 'LOSE' ? pink[700] : blue[700]}
          sx={{
            fontFamily: 'Zen Tokyo Zoo',
          }}
        >
          {(result === 'WIN' || result === 'LOSE') ? `YOU ${result}` : result}
        </Typography>
      </Grid>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <Button
          fullWidth
          size="large"
          sx={{
            color: blueGrey[100],
          }}
          onClick={() =>
            dispatch({ type: 'SET_GAME_STATUS', payload: 'entrance' })
          }
        >
          play again
        </Button>
      </Grid>
      <Grid item xs={4} />
    </Grid>
  );
};

export default DisplayPoints;
