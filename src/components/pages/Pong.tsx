import { Box, Container, Typography } from '@mui/material';
import { Sphere } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useContext, useEffect } from 'react';
import { blueGrey } from '@mui/material/colors';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import { EVENT } from '../config/constants';

const Pong = () => {
  const { client } = useContext(SocketContext);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    if (client) {
      client.index.emit(EVENT.PING);
      client.users.emit(EVENT.USER_STATUS, {
        status: 'game',
        userID: authUser?.id,
      });
    }
    return () => {
      if (client)
        client.users.emit(EVENT.USER_STATUS, {
          status: 'online',
          userID: authUser?.id,
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  return (
    <Container component="main" maxWidth="xl" sx={{ padding: 2 }}>
      <Box
        component="div"
        zIndex={500}
        m={2}
        p={2}
        sx={{ position: 'absolute' }}
        alignItems="center"
        justifyItems="center"
      >
        <Typography
          variant="h2"
          color={blueGrey[100]}
          sx={{
            fontFamily: 'Zen Tokyo Zoo',
          }}
        >
          PONG
        </Typography>
      </Box>
      <Box component="div">
        <Canvas
          style={{ height: 'calc(100vh - 172px)', backgroundColor: blueGrey[800] }}
        >
          <ambientLight />
          <Sphere>
            <meshNormalMaterial />
          </Sphere>
        </Canvas>
      </Box>
    </Container>
  );
};

export default Pong;
