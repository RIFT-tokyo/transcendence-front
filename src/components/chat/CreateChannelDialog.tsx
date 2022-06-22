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
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import { ChangeEvent, Dispatch, SetStateAction, useReducer } from 'react';
import { Channel, ChannelApi, NewChannel } from '../../api/generated';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  addChannel: (channel: Channel) => void;
};

type State = {
  name: string;
  password: string;
  showPassword: boolean;
  errorName: boolean;
  errorPassword: boolean;
  isPrivate: boolean;
  isRequesting: boolean;
};

type Actions =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_SHOW_PASSWORD' }
  | { type: 'SET_ERROR_NAME'; payload: boolean }
  | { type: 'SET_ERROR_PASSWORD'; payload: boolean }
  | { type: 'SET_IS_PRIVATE'; payload: boolean }
  | { type: 'SET_IS_REQUESTING'; payload: boolean }
  | { type: 'CLOSE_DIALOG' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_ERROR_NAME':
      return { ...state, errorName: action.payload };
    case 'SET_ERROR_PASSWORD':
      return { ...state, errorPassword: action.payload };
    case 'SET_IS_PRIVATE':
      return { ...state, isPrivate: action.payload };
    case 'SET_IS_REQUESTING':
      return { ...state, isRequesting: action.payload };
    case 'CLOSE_DIALOG':
      return {
        ...state,
        name: '',
        password: '',
        errorName: false,
        errorPassword: false,
      };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustivenessCheck: never = action;
      return state;
    }
  }
};

const CreateChannelDialog = (props: Props) => {
  const { open, setOpen, addChannel } = props;
  const [state, dispatch] = useReducer(reducer, {
    name: '',
    password: '',
    showPassword: false,
    errorName: false,
    errorPassword: false,
    isPrivate: false,
    isRequesting: false,
  });
  const channelApi = new ChannelApi();
  const { enqueueSnackbar } = useSnackbar();

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NAME', payload: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
  };

  const handleIsPrivateChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_IS_PRIVATE', payload: e.target.checked });
  };

  const handleVisibilityChange = () => {
    dispatch({ type: 'TOGGLE_SHOW_PASSWORD' });
  };

  const closeDialog = () => {
    dispatch({ type: 'CLOSE_DIALOG' });
    setOpen(false);
  };
  const isValidName = (channelName: string): boolean => !!channelName;
  const isValidPassword = (channelPassword: string): boolean =>
    !state.isPrivate || !!channelPassword;

  const validateFields = (
    channelName: string,
    channelPassword: string,
  ): boolean => {
    dispatch({ type: 'SET_ERROR_NAME', payload: !isValidName(channelName) });
    dispatch({
      type: 'SET_ERROR_PASSWORD',
      payload: !isValidPassword(channelPassword),
    });
    return isValidName(channelName) && isValidPassword(channelPassword);
  };

  const createChannel = async (
    channelName: string,
    channelPassword: string,
  ) => {
    if (!validateFields(channelName, channelPassword)) {
      return;
    }
    const newChannel: NewChannel = { name: channelName };
    if (state.isPrivate && state.password) {
      newChannel.password = channelPassword;
    }
    try {
      dispatch({ type: 'SET_IS_REQUESTING', payload: true });
      const res = await channelApi.postChannels(newChannel, {
        withCredentials: true,
      });
      closeDialog();
      addChannel(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response?.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      } else if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'SET_IS_REQUESTING', payload: false });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Create Channel</DialogTitle>
      <DialogContent>
        <Box component="form">
          <TextField
            required
            autoFocus
            fullWidth
            margin="dense"
            id="name"
            label="Channel Name"
            value={state.name}
            disabled={state.isRequesting}
            onChange={handleNameChange}
            error={state.errorName}
            helperText={
              state.errorName ? 'Please fill Channel Name field' : undefined
            }
          />
          <FormControlLabel
            sx={{ display: 'flex', justifyContent: 'space-between' }}
            control={
              <Switch
                checked={state.isPrivate}
                onChange={handleIsPrivateChange}
              />
            }
            label="Private Channel"
            labelPlacement="start"
          />
          <Collapse in={state.isPrivate}>
            <TextField
              fullWidth
              margin="dense"
              id="password"
              label="Channel Password"
              type={state.showPassword ? 'text' : 'password'}
              value={state.password}
              disabled={state.isRequesting || !state.isPrivate}
              onChange={handlePasswordChange}
              error={state.errorPassword}
              helperText={
                state.errorPassword
                  ? 'Please fill Channel Password field'
                  : undefined
              }
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleVisibilityChange}
                    edge="end"
                  >
                    {state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Collapse>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          onClick={() => createChannel(state.name, state.password)}
          disabled={state.isRequesting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateChannelDialog;
