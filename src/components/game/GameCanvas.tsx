import { blue, blueGrey, pink } from '@mui/material/colors';
import {
  Cylinder,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import Stage from './geometry/Stage';
import { GameContext } from './types/gameStatus';

interface Props {
  context: GameContext;
  // eslint-disable-next-line no-unused-vars
  setContext: (context: GameContext) => void;
}

interface State {
  cameraPosition: [x: number, y: number, z: number];
}

const GameCanvas = ({ context, setContext }: Props) => {
  const [state, setState] = useState<State>({
    cameraPosition: [0, 3, 15],
  });
  useEffect(() => {
    if (context.gameStatus === 'play') {
      setState({ ...state, cameraPosition: [0, 3, 15] });
      setContext({ ...context, hostPoints: 11, guestPoints: 8 });
    } else if (context.gameStatus === 'watch') {
      setState({ ...state, cameraPosition: [7, 9, 0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.gameStatus]);
  return (
    <Canvas
      shadows
      style={{ height: 'calc(100vh - 188px)', backgroundColor: blueGrey[900] }}
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
