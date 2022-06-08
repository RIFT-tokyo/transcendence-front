import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useReducer } from 'react';
import { Channel, ChannelApi, NewChannel } from '../../api/generated';
import SubscribeChannelPanel from './SubscribeChannelPanel';
import { reducer } from './types/reducer';
import CreateChannelPanel from './CreateChannelPanel';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  addChannel: (channel: Channel) => void;
};

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`channel-dialog-tabpanel-${index}`}
      aria-labelledby={`channel-dialog-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box component="div" pt={3} pl={3} pr={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ChannelDialog = (props: Props) => {
  const { open, setOpen, addChannel } = props;
  const [state, dispatch] = useReducer(reducer, {
    name: '',
    password: '',
    showPassword: false,
    errorName: false,
    errorPassword: false,
    isPrivate: false,
    isRequesting: false,
    tabIndex: 1,
    channels: [],
  });
  const channelApi = new ChannelApi();
  const { enqueueSnackbar } = useSnackbar();

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
      addChannel(res.data);
      closeDialog();
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response?.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      } else if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'SET_IS_REQUESTING', payload: false });
  };

  const handleTabIndexChange = (_: React.SyntheticEvent, newValue: number) => {
    dispatch({ type: 'SET_TAB_INDEX', payload: newValue });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogContent sx={{ height: 420 }}>
        <Tabs
          value={state.tabIndex}
          onChange={handleTabIndexChange}
          aria-label="channdl dialog tabs"
        >
          <Tab
            label="Subscribe Channel"
            id="channel-dialog-0"
            aria-controls="channel-dialog-tabpanel-0"
          />
          <Tab
            label="Create Channel"
            id="channel-dialog-1"
            aria-controls="channel-dialog-tabpanel-1"
          />
        </Tabs>
        <TabPanel value={state.tabIndex} index={0}>
          <SubscribeChannelPanel channels={state.channels} />
        </TabPanel>
        <TabPanel value={state.tabIndex} index={1}>
          <CreateChannelPanel state={state} dispatch={dispatch} />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
        {state.tabIndex === 1 && (
          <Button
            onClick={() => createChannel(state.name, state.password)}
            disabled={state.isRequesting}
          >
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChannelDialog;
