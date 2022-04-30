import { Box, Grid, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useState } from 'react';
import { GameStatus } from './types/gameStatus';
import HostGame from './navigation/HostGame';
import JoinGame from './navigation/JoinGame';
import Waiting from './navigation/Waiting';
import Welcome from './navigation/Welcome';
import DisplayPoints from './navigation/DisplayPoints';
import DisplayResult from './navigation/DisplayResult';

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
        {state !== 'play' && state !== 'end' &&
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
                onClick={() => setState('play')}
              >
                PONG
              </Typography>
            </Grid>
            {state === 'welcome' && <Welcome setStatus={setState} />}
            {state === 'host' && <HostGame setStatus={setState} />}
            {state === 'join' && <JoinGame setStatus={setState} />}
            {state === 'waiting' && <Waiting setStatus={setState} />}
          </Grid>
        }
        {state === 'play' && <DisplayPoints setStatus={setState} />}
        {state === 'end' && <DisplayResult setStatus={setState} />}
      </Box>
    </Box>
  );
};

export default Navigation;
