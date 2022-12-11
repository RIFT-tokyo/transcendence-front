import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import ChatIcon from '@mui/icons-material/Chat';
import { Dispatch, useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import { Actions, GameState } from '../types/reducer';
import usePong from '../../../api/websocket/usePong';
import { Match, PmApi, User } from '../../../api/generated/api';
import { AuthContext } from '../../../contexts/AuthContext';
import BackToTop from './BackToTop';
import InviteUserList from './InviteUserList';
import useMessage from '../../../api/websocket/useMessage';

interface Props {
  context: GameState;
  dispatch: Dispatch<Actions>;
}

const pmApi = new PmApi();

const Waiting = ({ context, dispatch }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { readyMatch } = usePong();
  const { sendPrivateMessage } = useMessage();
  const { authUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const callback = (match: Match) => {
    dispatch({
      type: 'SET_IS_HOST',
      payload: match.host_player?.id === authUser?.id,
    });
    dispatch({ type: 'SET_HOST_PLAYER', payload: match.host_player ?? null });
    dispatch({ type: 'SET_GUEST_PLAYER', payload: match.guest_player ?? null });
    dispatch({ type: 'SET_GAME_STATUS', payload: 'play' });
  };

  const fetchFriends = async () => {
    try {
      // TODO: follow usersにする必要あり
      const res = await pmApi.getMePms({ withCredentials: true });
      setFriends(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
  };

  const handleInvite = async () => {
    if (!selectedUser?.id) {
      return;
    }
    // TODO: chat画面でURLをハイパーリンクに表示する
    sendPrivateMessage(
      `▼ pong with me ▼
        http://localhost:4212/pong?roomId=${context.roomId}
      `,
      authUser!.id!,
      selectedUser.id,
    );
    enqueueSnackbar('Invited successfully!', { variant: 'success' });
    setOpen(false);
  };

  useEffect(() => {
    (async () => {
      if (context.roomId) {
        readyMatch(context.roomId, callback);
      }
      await fetchFriends();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container item xs={12} spacing={4} marginY={5}>
      <Grid
        container
        item
        xs={12}
        spacing={1}
        alignItems="center"
        display="flex"
        direction="column"
      >
        {context.roomId && (
          <Typography variant="h4" color={blueGrey[100]}>
            Room ID: {context.roomId}
          </Typography>
        )}
        <Typography variant="h4" color={blueGrey[100]}>
          Waiting for other player to join
        </Typography>
      </Grid>
      <Grid
        container
        item
        xs={12}
        spacing={1}
        alignItems="center"
        display="flex"
        direction="column"
      >
        <CircularProgress sx={{ color: blueGrey[100] }} />
      </Grid>
      {
        // TODO: auto matchの時は出したくない
        context.roomId && (
          <>
            <Grid item xs={3} />
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                sx={{
                  color: blueGrey[100],
                }}
                startIcon={<ChatIcon />}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Invite by chat
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={3} />
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              fullWidth
              maxWidth="xs"
            >
              <DialogTitle>Invite by chat</DialogTitle>
              <DialogContent sx={{ maxHeight: 420 }}>
                <InviteUserList
                  users={friends}
                  selectedUser={selectedUser}
                  handleClick={setSelectedUser}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={!selectedUser}>
                  Invite
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )
      }
      <Grid item xs={4} />
      <Grid item xs={4}>
        <BackToTop context={context} dispatch={dispatch} />
      </Grid>
      <Grid item xs={4} />
    </Grid>
  );
};
export default Waiting;
