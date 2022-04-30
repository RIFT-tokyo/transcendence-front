import { Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { GameStatus } from '../types/gameStatus';

interface Props {
  // eslint-disable-next-line no-unused-vars
  setStatus: (state: GameStatus) => void;
}

const DisplayPoints = ({ setStatus }: Props) => (
  <Grid container>
    <Grid
      item
      container
      xs={12}
      marginY={5}
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
        GAME POINTS
      </Typography>
      <Typography variant="h1" color={blueGrey[200]}>
        6 - 3
      </Typography>
    </Grid>
  </Grid>
);

export default DisplayPoints;
