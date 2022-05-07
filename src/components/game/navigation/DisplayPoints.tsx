import { Grid, Typography } from '@mui/material';
import { blue, blueGrey, pink } from '@mui/material/colors';
import { User } from '../../../api/generated';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
  hostPlayer: User;
  guestPlayer: User;
  hostPoints: number;
  guestPoints: number;
}

const DisplayPoints = ({
  setStatus,
  hostPlayer,
  guestPlayer,
  hostPoints,
  guestPoints,
}: Props) => (
  <Grid container padding={4} spacing={2}>
    <Grid
      item
      container
      xs={4}
      marginTop={6}
      alignItems="right"
      direction="row-reverse"
    >
      <Typography variant="h4" color={blue[700]}>
        {hostPlayer.display_name ?? hostPlayer.username}
      </Typography>
    </Grid>
    <Grid
      item
      container
      xs={4}
      alignItems="center"
      display="flex"
      direction="column"
    >
      <Typography
        variant="h4"
        color={blueGrey[200]}
        sx={{
          fontFamily: 'Zen Tokyo Zoo',
        }}
        onClick={() => setStatus('end')}
      >
        POINTS
      </Typography>
      <Typography variant="h2" color={blueGrey[200]}>
        {hostPoints} - {guestPoints}
      </Typography>
    </Grid>
    <Grid item container xs={4} marginTop={6} alignItems="left">
      <Typography variant="h4" color={pink[700]}>
        {guestPlayer.display_name ?? guestPlayer.username}
      </Typography>
    </Grid>
  </Grid>
);

export default DisplayPoints;
