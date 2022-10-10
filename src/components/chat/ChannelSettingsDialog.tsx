import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import { Dispatch, MouseEvent, SetStateAction, useReducer, useEffect } from 'react';
import { Channel, ChannelApi, ChannelUser, Role } from '../../api/generated';
import ModerationSettings from './ModerationSettings';
import OverviewSettings from './OverviewSettings';
import RolesSettings from './RolesSettings';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  channel: Channel;
};

type State = {
  selectedIndex: number;
  channelUsers: ChannelUser[];
  isLoading: boolean;
};

type Actions =
  | { type: 'SET_SELECTED_INDEX'; payload: number }
  | { type: 'SET_CHANNEL_USERS'; payload: ChannelUser[] }
  | { type: 'SET_IS_LOADING'; payload: boolean };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_SELECTED_INDEX':
      return { ...state, selectedIndex: action.payload };
    case 'SET_CHANNEL_USERS':
      return { ...state, channelUsers: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return state;
    }
  }
};

const channelApi = new ChannelApi();

const ChannelSettingsDialog = (props: Props) => {
  const { open, setOpen, channel } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, {
    selectedIndex: 0,
    channelUsers: [],
    isLoading: false,
  });

  const setPermission = async (newValue: ChannelUser[]) => {
    if (state.isLoading) {
      return;
    }
    dispatch({ type: 'SET_IS_LOADING', payload: true });

    try {
      if (!channel.id) {
        return;
      }
      const { data } = await channelApi.putChannelsChannelIDUsers(channel.id, newValue, { withCredentials: true });
      dispatch({ type: 'SET_CHANNEL_USERS', payload: data });
      enqueueSnackbar('Permission updated', { variant: 'success' });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar('Permission update failed', { variant: 'error' });
      }
    }
    dispatch({ type: 'SET_IS_LOADING', payload: false });
  };

  const listItems = [
    {
      name: 'Overview',
      component: <OverviewSettings channel={channel} />,
      visible: () => true,
    },
    {
      name: 'Moderation',
      component: <ModerationSettings role={channel.role} channelUsers={state.channelUsers} setPermission={setPermission} />,
      visible: () => true,
    },
    {
      name: 'Roles',
      component: <RolesSettings channelUsers={state.channelUsers} setPermission={setPermission} />,
      visible: () => channel.role === Role.Owner,
    },
  ];

  const closeDialog = () => {
    setOpen(false);
  };

  const handleListItemClick = (
    event: MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    dispatch({ type: 'SET_SELECTED_INDEX', payload: index });
  };

  useEffect(() => {
    const fetchChannelUserPermissions = async () => {
      if (!channel.id) {
        return;
      }
      dispatch({ type: 'SET_IS_LOADING', payload: true });
      const { data } = await channelApi.getChannelsUsersUserID(channel.id, {
        withCredentials: true,
      });
      dispatch({ type: 'SET_CHANNEL_USERS', payload: data });
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    };

    fetchChannelUserPermissions();
  }, [channel.id]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          <List
            sx={[
              (theme) => ({
                '&& .Mui-selected, && .Mui-selected:hover': {
                  backgroundColor: theme.palette.selected.main,
                },
              }),
            ]}
          >
            {listItems
              .filter((item) => item.visible())
              .map((item, index) => (
                <ListItemButton
                  key={`listItem-${item.name}`}
                  selected={state.selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>
              ))}
          </List>
          <Divider orientation="vertical" flexItem variant="middle" />
          <Box component="div" width={400}>
            <Typography variant="h6" pb={2}>
              {listItems[state.selectedIndex].name}
            </Typography>
            {listItems[state.selectedIndex].component}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChannelSettingsDialog;
