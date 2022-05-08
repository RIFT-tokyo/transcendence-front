import { Grid, Typography, CircularProgress, Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import ChatIcon from '@mui/icons-material/Chat';
import { GameContext } from '../types/gameStatus';

interface Props {
  context: GameContext;
  // eslint-disable-next-line no-unused-vars
  setContext: (context: GameContext) => void;
}
const Waiting = ({ context, setContext }: Props) => (
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
        Room ID: {context.roomId}
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
    <Grid item xs={3} />
    <Grid item xs={6}>
      <Button
        fullWidth
        variant="outlined"
        color="inherit"
        sx={{
          color: blueGrey[100],
        }}
        startIcon={<ChatIcon />}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Invite by chat
        </Typography>
      </Button>
    </Grid>
    <Grid item xs={3} />
    <Grid item xs={4} />
    <Grid item xs={4}>
      <Button
        fullWidth
        size="small"
        sx={{
          color: blueGrey[100],
        }}
        onClick={() => setContext({ ...context, gameStatus: 'entrance' })}
      >
        Back to Top
      </Button>
    </Grid>
    <Grid item xs={4} />
  </Grid>
);

export default Waiting;
