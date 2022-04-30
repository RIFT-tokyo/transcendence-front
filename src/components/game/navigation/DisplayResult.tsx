import { Button, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
}

const DisplayPoints = ({ setStatus }: Props) => (
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
        onClick={() => setStatus('end')}
      >
        RESULT
      </Typography>
      <Typography variant="h1" color={blueGrey[200]}>
        8 - 11
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
        color="secondary"
        sx={{
          fontFamily: 'Zen Tokyo Zoo',
        }}
      >
        YOU LOSE
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Button
        fullWidth
        size="large"
        sx={{
          color: blueGrey[100],
        }}
        onClick={() => setStatus('welcome')}
      >
        play again
      </Button>
    </Grid>
  </Grid>
);

export default DisplayPoints;
