import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { PmApi, User, UserApi } from '../../api/generated';
import CreatePMDialogList from './CreatePMDialogList';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  joinedPMUsers: User[];
  addPMUser: (user: User) => void;
};

type State = {
  users: User[];
  selectedUser: User | null;
  isRequesting: boolean;
};

type Actions =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_SELECTED_USER'; payload: User | null }
  | { type: 'SET_IS_REQUESTING'; payload: boolean }
  | { type: 'CLOSE_DIALOG' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };
    case 'SET_IS_REQUESTING':
      return { ...state, isRequesting: action.payload };
    case 'CLOSE_DIALOG':
      return {
        ...state,
        selectedChannel: null,
        isRequesting: false,
      };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustivenessCheck: never = action;
      return state;
    }
  }
};

const userApi = new UserApi();
const pmApi = new PmApi();

const CreatePMDialog = (props: Props) => {
  const { open, setOpen, joinedPMUsers, addPMUser } = props;
  const { authUser } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, {
    users: [],
    selectedUser: null,
    isRequesting: false,
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (user: User) => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
  };

  const closeDialog = () => {
    dispatch({ type: 'CLOSE_DIALOG' });
    setOpen(false);
  };

  const handleClickCreate = async () => {
    if (!state.selectedUser?.id) {
      return;
    }
    dispatch({ type: 'SET_IS_REQUESTING', payload: true });
    try {
      const res = await pmApi.putMePmsUserid(
        state.selectedUser.id,
        { withCredentials: true },
      );
      closeDialog();
      addPMUser(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err)) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'SET_IS_REQUESTING', payload: false });
  };

  // TODO: ページネーションをなくす
  const fetchUsers = async () => {
    try {
      const res = await userApi.getUsers(20, 0, { withCredentials: true });
      dispatch({ type: 'SET_USERS', payload: res.data.entries ?? [] });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response?.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      } else if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Create PM</DialogTitle>
      <DialogContent sx={{ maxHeight: 420 }}>
        <CreatePMDialogList
          users={state.users.filter(
            (user) => !(joinedPMUsers.find((u) => u.id === user.id) || user.id === authUser?.id),
          )}
          selectedUser={state.selectedUser}
          handleClick={handleClick}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleClickCreate} disabled={!state.selectedUser}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePMDialog;
