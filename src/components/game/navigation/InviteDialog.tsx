import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useContext, useState } from 'react';
import { FollowApi, User } from '../../../api/generated/api';
import useMessage from '../../../api/websocket/useMessage';
import { AuthContext } from '../../../contexts/AuthContext';
import ScrollObserver from '../../ui/ScrollObserver';
import InviteUserList from './InviteUserList';

interface Props {
  roomId: string;
  open: boolean;
  setOpen: (newValue: boolean) => void;
}

const followApi = new FollowApi();

const InviteDialog = ({ roomId, open, setOpen }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { sendPrivateMessage } = useMessage();
  const { authUser } = useContext(AuthContext);

  const [offset, setOffset] = useState(0);
  const [isActiveObserver, setIsActiveObserver] = useState(true);
  const [followings, setFollowings] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleInvite = async () => {
    if (!selectedUser?.id) {
      return;
    }
    // TODO: chat画面でURLをハイパーリンクに表示する
    sendPrivateMessage(
      `▼ Play Pong Together ▼
http://localhost:4212/pong?roomId=${roomId}`,
      authUser!.id!,
      selectedUser.id,
    );
    enqueueSnackbar('Invited successfully!', { variant: 'success' });
    setOpen(false);
  };

  const fetchNextFollowings = useCallback(async () => {
    const { data } = await followApi.getUsersUserIDFollowing(
      authUser!.id!,
      undefined,
      offset,
      {
        withCredentials: true,
      },
    );
    if (data.has_next === false) {
      setIsActiveObserver(false);
    }
    setOffset((prev) => prev + 10);
    setFollowings((prev) => [...prev, ...(data.entries || [])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Invite by chat</DialogTitle>
      <DialogContent sx={{ maxHeight: 420 }}>
        <Stack maxHeight={256} sx={{ overflowY: 'auto' }}>
          <InviteUserList
            users={followings}
            selectedUser={selectedUser}
            handleClick={setSelectedUser}
          />
          <ScrollObserver
            onIntersect={fetchNextFollowings}
            isActiveObserver={isActiveObserver}
          />
        </Stack>
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
  );
};

export default InviteDialog;
