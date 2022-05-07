import { blueGrey } from '@mui/material/colors';
import { RoundedBox } from '@react-three/drei';

const Stage = () => (
  <>
    <RoundedBox
      args={[0.4, 1, 20]}
      position={[-4, 0, 0]}
      rotation={[0, 0, 0]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial color={blueGrey[500]} />
    </RoundedBox>
    <RoundedBox
      args={[0.4, 1, 20]}
      position={[4, 0, 0]}
      rotation={[0, 0, 0]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial color={blueGrey[500]} />
    </RoundedBox>
    <RoundedBox
      args={[8.4, 0.4, 20]}
      position={[0, -0.4, 0]}
      rotation={[0, 0, 0]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial color={blueGrey[500]} />
    </RoundedBox>
  </>
);

export default Stage;
