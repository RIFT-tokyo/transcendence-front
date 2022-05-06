import { Button, Grid, Typography } from '@mui/material';
import { blue, blueGrey, pink } from '@mui/material/colors';
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
    if (
      context.hostPoints > context.guestPoints &&
      context.hostPlayer?.id === authUser?.id
    ) {
      setResult('WIN');
    } else if (
      context.hostPoints < context.guestPoints &&
      context.guestPlayer?.id === authUser?.id
    ) {
      setResult('LOSE');
    } else {
      const winner =
        context.hostPoints > context.guestPoints
          ? context.hostPlayer
          : context.guestPlayer;
      setResult(`${winner?.display_name ?? winner?.username} WINS`);
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
          color={result === 'LOSE' ? pink[700] : blue[700]}
          sx={{
            fontFamily: 'Zen Tokyo Zoo',
          }}
        >
          {result === 'WIN' || result === 'LOSE' ? `YOU ${result}` : result}
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
          onClick={() => setContext({ ...context, gameStatus: 'entrance' })}
        >
          play again
        </Button>
      </Grid>
      <Grid item xs={4} />
    </Grid>
  );
};

export default DisplayPoints;