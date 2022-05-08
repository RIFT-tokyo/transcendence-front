import { Grid, Button, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import GroupIcon from '@mui/icons-material/Group';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { blueGrey } from '@mui/material/colors';
import { GameContext } from '../types/gameStatus';

interface Props {
  context: GameContext;
  // eslint-disable-next-line no-unused-vars
  setContext: (context: GameContext) => void;
}

const Entrance = ({ context, setContext }: Props) => (
  <Grid container item xs={12} marginY={5}>
    <Grid item xs={3} />
    <Grid container item xs={6} spacing={2}>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          startIcon={<ShuffleIcon />}
          sx={{
            color: blueGrey[100],
          }}
          onClick={() => setContext({ ...context, gameStatus: 'waiting' })}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            auto match
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          startIcon={<GroupIcon />}
          sx={{
            color: blueGrey[100],
          }}
          onClick={() => setContext({ ...context, gameStatus: 'friend_match' })}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            friend match
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          startIcon={<LiveTvIcon />}
          sx={{
            color: blueGrey[100],
          }}
          onClick={() => setContext({ ...context, gameStatus: 'watch_match' })}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            watch match
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          startIcon={<SettingsIcon />}
          sx={{
            color: blueGrey[100],
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            settings
          </Typography>
        </Button>
      </Grid>
    </Grid>
    <Grid item xs={3} />
  </Grid>
);

export default Entrance;
