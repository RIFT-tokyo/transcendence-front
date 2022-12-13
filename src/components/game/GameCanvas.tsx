import { blue, blueGrey, pink } from '@mui/material/colors';
import {
  Cylinder,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useState, Dispatch } from 'react';
import Stage from './geometry/Stage';
import { Actions, GameState, Vector } from './types/reducer';
import { PADDLE_SPEED, PADDLE_X, STAGE_X, X, Y, Z } from '../config/constants';
import useControls from '../../functions/useControls';
import usePong from '../../api/websocket/usePong';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
  tick: boolean;
  setTick: React.Dispatch<React.SetStateAction<boolean>>
}

interface State {
  cameraPosition: [x: number, y: number, z: number];
}

const GameCanvas = ({ context, dispatch, tick, setTick }: Props) => {
  const controls = useControls();

  const [state, setState] = useState<State>({
    cameraPosition: [7, 9, 0],
  });

  useEffect(() => {
    if (context.gameStatus === 'play') {
      if (context.isHost) {
        setState({ ...state, cameraPosition: [0, 3, 15] });
      } else {
        setState({ ...state, cameraPosition: [0, 3, -15] });
      }
    } else if (context.gameStatus === 'watch') {
      setState({ ...state, cameraPosition: [7, 9, 0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.gameStatus]);

  useFrame(() => {
    const { left, right } = controls.current;

    if (context.gameStatus !== 'play') {
      return;
    }

    if (context.isHost) {
      if (left && context.hostPosition[X] > -(STAGE_X - PADDLE_X) / 2) {
        dispatch({
          type: 'SET_HOST_POSITION',
          payload: [
            context.hostPosition[X] - PADDLE_SPEED,
            context.hostPosition[Y],
            context.hostPosition[Z],
          ],
        });
      }
      if (right && context.hostPosition[X] < (STAGE_X - PADDLE_X) / 2) {
        dispatch({
          type: 'SET_HOST_POSITION',
          payload: [
            context.hostPosition[X] + PADDLE_SPEED,
            context.hostPosition[Y],
            context.hostPosition[Z],
          ],
        });
      }
    } else {
      if (left && context.guestPosition[X] < (STAGE_X - PADDLE_X) / 2) {
        dispatch({
          type: 'SET_GUEST_POSITION',
          payload: [
            context.guestPosition[X] + PADDLE_SPEED,
            context.guestPosition[Y],
            context.guestPosition[Z],
          ],
        });
      }
      if (right && context.guestPosition[X] > -(STAGE_X - PADDLE_X) / 2) {
        dispatch({
          type: 'SET_GUEST_POSITION',
          payload: [
            context.guestPosition[X] - PADDLE_SPEED,
            context.guestPosition[Y],
            context.guestPosition[Z],
          ],
        });
      }
    }
    setTick(!tick);
  });

  return (
    <Suspense fallback={null}>
      <PerspectiveCamera makeDefault position={state.cameraPosition} fov={75} />
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
        position={context.hostPosition}
        rotation={[0, 0, 0]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color={blue[700]} />
      </RoundedBox>
      <RoundedBox
        args={[2, 0.4, 0.4]}
        position={context.guestPosition}
        rotation={[0, 0, 0]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color={pink[700]} />
      </RoundedBox>
      <Cylinder
        args={[0.3, 0.3, 0.1, 32]}
        position={context.ballPosition}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color={blueGrey[100]} />
      </Cylinder>
    </Suspense>
  );
};

export default GameCanvas;
