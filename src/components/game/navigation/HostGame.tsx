import { Grid, TextField, Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
}

const HostGame = ({ setStatus }: Props) => (
  <Grid container item xs={12} spacing={4} marginY={5}>
    <Grid
      container
      item
      xs={12}
      spacing={1}
      alignItems="center"
    >
      <Grid item xs={9}>
        <TextField
          fullWidth
          size="small"
          sx={{
            borderRadius: 1,
            backgroundColor: blueGrey[100]
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          fullWidth
          size="large"
          color='inherit'
          variant="contained"
          sx={{
            color: blueGrey[900],
            backgroundColor: blueGrey[100],
          }}
          onClick={() => setStatus('waiting')}
        >
          create room
        </Button>
      </Grid>
    </Grid>
    <Grid item xs={12}>
      <Button
        fullWidth
        size="small"
        sx={{
          color: blueGrey[100],
        }}
        onClick={() => setStatus('welcome')}
      >
        Back to Top
      </Button>
    </Grid>
  </Grid>
);

export default HostGame;
