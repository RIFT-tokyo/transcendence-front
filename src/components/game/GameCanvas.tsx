import { blueGrey } from '@mui/material/colors';
import { Sphere } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

const GameCanvas = () => (
  <Canvas
    style={{ height: 'calc(100vh - 188px)', backgroundColor: blueGrey[900] }}
  >
    <ambientLight />
    <Sphere>
      <meshNormalMaterial />
    </Sphere>
  </Canvas>
);

export default GameCanvas;
