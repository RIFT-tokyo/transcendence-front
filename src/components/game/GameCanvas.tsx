import { blue, blueGrey, pink } from '@mui/material/colors';
import {
  Cylinder,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useContext, Dispatch } from 'react';
import Stage from './geometry/Stage';
import { Actions, GameState } from './types/reducer';
import { AuthContext } from '../../contexts/AuthContext';
import { GAME_HEIGHT } from '../config/constants';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

interface State {
  cameraPosition: [x: number, y: number, z: number];
}

const GameCanvas = ({ context, dispatch }: Props) => {
  const { authUser } = useContext(AuthContext);
  const [state, setState] = useState<State>({
    cameraPosition: [7, 9, 0],
  });
  useEffect(() => {
    if (context.gameStatus === 'play') {
      if (context.hostPlayer?.id === authUser?.id) {
        setState({ ...state, cameraPosition: [0, 3, 15] });
      } else if (context.guestPlayer?.id === authUser?.id) {
        setState({ ...state, cameraPosition: [0, 3, -15] });
      }
      dispatch({ type: 'ADD_POINTS', payload: 'host'});
    } else if (context.gameStatus === 'watch') {
      setState({ ...state, cameraPosition: [7, 9, 0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.gameStatus]);
  return (
    <Canvas
      shadows
      style={{
        height: GAME_HEIGHT,
        backgroundColor: blueGrey[900],
      }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          position={state.cameraPosition}
          fov={75}
        />
        <OrbitControls makeDefault />
        <pointLight
          position={[-6, 3, 15]}
          castShadow
          intensity={0.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight
          position={[0, 15, 0]}
          castShadow
          intensity={0.6}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight
          position={[5, 4, -15]}
          castShadow
          intensity={0.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Stage />
        <RoundedBox
          args={[2, 0.4, 0.4]}
          position={[0, 0, 9.5]}
          rotation={[0, 0, 0]}
          radius={0.1}
          smoothness={4}
        >
          <meshStandardMaterial color={blue[700]} />
        </RoundedBox>
        <RoundedBox
          args={[2, 0.4, 0.4]}
          position={[0, 0, -9.5]}
          rotation={[0, 0, 0]}
          radius={0.1}
          smoothness={4}
        >
          <meshStandardMaterial color={pink[700]} />
        </RoundedBox>
        <Cylinder
          args={[0.3, 0.3, 0.1, 32]}
          position={[0, -0.1, 8]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial color={blueGrey[100]} />
        </Cylinder>
      </Suspense>
    </Canvas>
  );
};

export default GameCanvas;
