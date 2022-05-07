import { Grid, Button, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
}

const FriendMatch = ({ setStatus }: Props) => (
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
          onClick={() => setStatus('host')}
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
          onClick={() => setStatus('join')}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            join room
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
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
    </Grid>
  </Grid>
);

export default FriendMatch;
