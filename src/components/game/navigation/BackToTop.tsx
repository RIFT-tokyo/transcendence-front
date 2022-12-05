import { Button } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Dispatch } from 'react';
import usePong from '../../../api/websocket/usePong';
import { Actions, GameState } from '../types/reducer';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

const BackToTop = ({ context, dispatch }: Props) => {
  const { leaveRoom } = usePong();
  const handleClick = () => {
    if (context.roomId) {
      leaveRoom(context.roomId, 'back_to_top');
    }
    dispatch({ type: 'SET_GAME_STATUS', payload: 'entrance' });
  };

  return (
    <Button
      fullWidth
      size="small"
      sx={{
        color: blueGrey[100],
      }}
      onClick={handleClick}
    >
      Back to Top
    </Button>
  );
};

export default BackToTop;
