import { Grid, Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
}

const Welcome = ({ setStatus }: Props) => (
  <Grid container item xs={12} spacing={4} marginY={5}>
    <Grid item xs={6}>
      <Button
        fullWidth
        size="large"
        color='inherit'
        variant="contained"
        sx={{
          color: blueGrey[900],
          backgroundColor: blueGrey[100],
        }}
        onClick={() => setStatus('host')}
      >
        host match
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button
        fullWidth
        size="large"
        color='inherit'
        variant="contained"
        sx={{
          color: blueGrey[900],
          backgroundColor: blueGrey[100],
        }}
        onClick={() => setStatus('join')}
      >
        join match
      </Button>
    </Grid>
  </Grid>
)

export default Welcome;