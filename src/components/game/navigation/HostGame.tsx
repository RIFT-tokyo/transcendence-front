import { Grid, TextField, Button, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
}

const HostGame = ({ setStatus }: Props) => (
  <Grid container item xs={12} spacing={4} marginY={5}>
    <Grid container item xs={12} spacing={1} alignItems="center">
      <Grid item xs={1} />
      <Grid item xs={7}>
        <TextField
          fullWidth
          sx={{
            borderRadius: 1,
            backgroundColor: blueGrey[100],
          }}
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
          onClick={() => setStatus('waiting')}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            create
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
        onClick={() => setStatus('entrance')}
      >
        Back to Top
      </Button>
    </Grid>
    <Grid item xs={4} />
  </Grid>
);

export default HostGame;
