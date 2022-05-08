import { Button, Grid, Typography } from '@mui/material';
import { blue, blueGrey } from '@mui/material/colors';
import { useContext, useEffect, useState } from 'react';
import { GameContext } from '../types/gameStatus';
import { AuthContext } from '../../../contexts/AuthContext';

interface Props {
  context: GameContext;
  // eslint-disable-next-line no-unused-vars
  setContext: (context: GameContext) => void;
}

const DisplayPoints = ({ context, setContext }: Props) => {
  const { authUser } = useContext(AuthContext);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const winner =
      context.hostPoints > context.guestPoints
        ? context.hostPlayer?.id
        : context.guestPlayer?.id;
    if (winner === authUser?.id) {
      setResult('YOU WIN');
    } else if (winner === null) {
      setResult('DRAW');
    } else {
      setResult('YOU LOSE');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          onClick={() => setContext({ ...context, gameStatus: 'end' })}
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
          color={blue[700]}
          sx={{
            fontFamily: 'Zen Tokyo Zoo',
          }}
        >
          {result}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          sx={{
            color: blueGrey[100],
          }}
          onClick={() => setContext({ ...context, gameStatus: 'entrance' })}
        >
          play again
        </Button>
      </Grid>
    </Grid>
  );
};

export default DisplayPoints;
