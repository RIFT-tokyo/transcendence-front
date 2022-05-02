import { blue, blueGrey, pink } from '@mui/material/colors';
import { Cylinder, OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Stage from './geometory/Stage';

const GameCanvas = () => (
  <Canvas
    shadows
    style={{ height: 'calc(100vh - 188px)', backgroundColor: blueGrey[900] }}
  >
    <Suspense fallback={null}>
      <PerspectiveCamera makeDefault position={[0, 3, 15]} fov={75} />
      <OrbitControls makeDefault />
      <pointLight position={[-6, 3, 15]} castShadow intensity={0.5} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[0, 15, 0]} castShadow intensity={0.6} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[5, 4, -15]} castShadow intensity={0.5} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <Stage />
      <RoundedBox args={[2, 0.4, 0.4]} position={[0, 0, 9.5]} rotation={[0, 0, 0]} radius={0.1} smoothness={4} >
        <meshStandardMaterial color={blue[700]} />
      </RoundedBox>
      <RoundedBox args={[2, 0.4, 0.4]} position={[0, 0, -9.5]} rotation={[0, 0, 0]} radius={0.1} smoothness={4} >
        <meshStandardMaterial color={pink[700]} />
      </RoundedBox>
      <Cylinder args={[0.3, 0.3, 0.1, 32]} position={[0, -0.1, 8]} rotation={[0, 0, 0]} >
        <meshStandardMaterial color={blueGrey[100]} />
      </Cylinder>
    </Suspense>
  </Canvas>
);

export default GameCanvas;
