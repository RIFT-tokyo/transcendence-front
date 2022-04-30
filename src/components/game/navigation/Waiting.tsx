import { Grid, Typography, CircularProgress, Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import ChatIcon from '@mui/icons-material/Chat';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
}
const Waiting = ({ setStatus }: Props) => (
  <Grid container item xs={12} spacing={4} marginY={5}>
    <Grid
      container
      item
      xs={12}
      spacing={1}
      alignItems="center"
      display="flex"
      direction="column"
    >
      <Typography variant="h4" color={blueGrey[100]}>
        Room Name: sample-room
      </Typography>
      <Typography variant="h4" color={blueGrey[100]}>
        Waiting for other player to join
      </Typography>
    </Grid>
    <Grid
      container
      item
      xs={12}
      spacing={1}
      alignItems="center"
      display="flex"
      direction="column"
    >
      <CircularProgress sx={{ color: blueGrey[100] }} />
    </Grid>
    <Grid item xs={12}>
      <Button
        fullWidth
        variant="contained"
        color="inherit"
        sx={{
          color: blueGrey[900],
          backgroundColor: blueGrey[100],
        }}
        endIcon={<ChatIcon />}
      >
        Invite by chat
      </Button>
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

export default Waiting;
