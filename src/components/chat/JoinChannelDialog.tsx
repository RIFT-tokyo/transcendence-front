import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useReducer,
} from 'react';
import { Channel, ChannelApi, ChannelPassword } from '../../api/generated';
import ChannelIcon from './ChannelIcon';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  joinedChannels: Channel[];
  addChannel: (channel: Channel) => void;
};

type State = {
  allChannels: Channel[];
  selectedChannel: Channel | null;
  password: string;
  showPassword: boolean;
  errorPassword: boolean;
  isRequesting: boolean;
};

type Actions =
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'SET_SELECTED_CHANNEL'; payload: Channel | null }
  | { type: 'TOGGLE_SHOW_PASSWORD' }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR_PASSWORD'; payload: boolean }
  | { type: 'SET_IS_REQUESTING'; payload: boolean }
  | { type: 'CLOSE_DIALOG' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return { ...state, allChannels: action.payload };
    case 'SET_SELECTED_CHANNEL':
      return { ...state, selectedChannel: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_ERROR_PASSWORD':
      return { ...state, errorPassword: action.payload };
    case 'SET_IS_REQUESTING':
      return { ...state, isRequesting: action.payload };
    case 'CLOSE_DIALOG':
      return {
        ...state,
        selectedChannel: null,
        password: '',
        errorPassword: false,
      };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustivenessCheck: never = action;
      return state;
    }
  }
};

const JoinChannelDialog = (props: Props) => {
  const { open, setOpen, joinedChannels, addChannel } = props;
  const [state, dispatch] = useReducer(reducer, {
    allChannels: [],
    selectedChannel: null,
    password: '',
    showPassword: false,
    errorPassword: false,
    isRequesting: false,
  });
  const channelApi = new ChannelApi();
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (channel: Channel) => {
    dispatch({ type: 'SET_SELECTED_CHANNEL', payload: channel });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
  };

  const handleVisibilityChange = () => {
    dispatch({ type: 'TOGGLE_SHOW_PASSWORD' });
  };

  const closeDialog = () => {
    dispatch({ type: 'CLOSE_DIALOG' });
    setOpen(false);
  };

  const isValidPassword = (): boolean =>
    !state.selectedChannel?.is_protected || !!state.password;

  const validateFields = (): boolean => {
    dispatch({ type: 'SET_ERROR_PASSWORD', payload: isValidPassword() });
    return isValidPassword();
  };

  const joinChannel = async () => {
    if (!state.selectedChannel?.id || !validateFields()) {
      return;
    }
    dispatch({ type: 'SET_IS_REQUESTING', payload: true });
    const channelPassword: ChannelPassword = {};
    if (state.selectedChannel.is_protected) {
      channelPassword.password = state.password;
    }
    try {
      const res = await channelApi.putMeChannelsChannelId(
        state.selectedChannel.id,
        channelPassword,
        {
          withCredentials: true,
        },
      );
      closeDialog();
      addChannel(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response?.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      } else if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannels({ withCredentials: true });
      dispatch({ type: 'SET_CHANNELS', payload: res.data });
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
      fetchChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Join Channel</DialogTitle>
      <DialogContent sx={{ maxHeight: 420 }}>
        <List sx={{ maxHeight: 330, overflowY: 'auto', pt: 0 }}>
          {state.allChannels
            .filter(
              (channel) => !joinedChannels.find((c) => c.id === channel.id),
            )
            .map((channel) => (
              <Fragment key={`channel-list-${channel.id}`}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={channel.id === state.selectedChannel?.id}
                    onClick={() => handleClick(channel)}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      width="100%"
                    >
                      <ChannelIcon
                        isProtected={channel.is_protected ?? false}
                      />
                      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        {channel.name}
                      </Typography>
                    </Stack>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </Fragment>
            ))}
        </List>
        <Collapse in={state.selectedChannel?.is_protected ?? false}>
          <Box component="form">
            <TextField
              fullWidth
              margin="dense"
              id="password"
              label="Channel Password"
              type={state.showPassword ? 'text' : 'password'}
              value={state.password}
              disabled={state.isRequesting}
              onChange={handlePasswordChange}
              error={state.errorPasswordField || state.errorPasswordLogin}
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
          </Box>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={joinChannel} disabled={!state.selectedChannel}>
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinChannelDialog;
