import { Box, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useState } from 'react';
import { GameStatus } from './types/gameStatus';
import HostGame from './navigation/HostGame';
import JoinGame from './navigation/JoinGame';
import Waiting from './navigation/Waiting';
import Welcome from './navigation/Welcome';

const Navigation = () => {
  const [state, setState] = useState<GameStatus>('welcome');

  return (
    <Box
      component="div"
      maxHeight="calc(100vh - 220px)"
      padding={2}
      sx={{ overflow: 'auto' }}
    >
      <Box
        margin="auto"
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="center"
        maxWidth="sm"
      >
        <Grid container spacing={10}>
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
              variant="h1"
              color={blueGrey[200]}
              sx={{
                fontFamily: 'Zen Tokyo Zoo',
              }}
            >
              PONG
            </Typography>
          </Grid>
          {state === 'welcome' && <Welcome setStatus={setState} />}
          {state === 'host' && <HostGame setStatus={setState} />}
          {state === 'join' && <JoinGame setStatus={setState} />}
          {state === 'waiting' && <Waiting setStatus={setState} />}
        </Grid>
      </Box>
    </Box>
  );
};

export default Navigation;
