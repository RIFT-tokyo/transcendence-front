import { Collapse, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useReducer } from 'react';
import { Channel } from '../../api/generated';
import ChannelListItem from './ChannelListItem';
import CreateChannelDialog from './CreateChannelDialog';
import JoinChannelDialog from './JoinChannelDialog';

type Props = {
  selectedChannel: Channel | null;
  channels: Channel[];
  addChannel: (channel: Channel) => void;
};

type State = {
  openCreateChannelDialog: boolean;
  openJoinChannelDialog: boolean;
  openChannels: boolean;
};

type Actions =
  | { type: 'OPEN_CREATE_CHANNEL_DIALOG' }
  | { type: 'OPEN_JOIN_CHANNEL_DIALOG' }
  | { type: 'OPEN_CHANNEL_LIST' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'OPEN_CREATE_CHANNEL_DIALOG':
      return {
        ...state,
        openCreateChannelDialog: !state.openCreateChannelDialog,
      };
    case 'OPEN_JOIN_CHANNEL_DIALOG':
      return {
        ...state,
        openJoinChannelDialog: !state.openJoinChannelDialog,
      };
    case 'OPEN_CHANNEL_LIST':
      return { ...state, openChannels: !state.openChannels };
    default:
      return state;
  }
};

const ChannelList = (props: Props) => {
  const { selectedChannel, channels, addChannel } = props;

  const [state, dispatch] = useReducer(reducer, {
    openCreateChannelDialog: false,
    openJoinChannelDialog: false,
    openChannels: true,
  });

  return (
    <Stack direction="column" spacing={0.5} width={220} flexShrink={0}>
      <Stack direction="row" alignItems="center">
        <IconButton
          aria-label="Toggle channel visibility"
          onClick={() => dispatch({ type: 'OPEN_CHANNEL_LIST' })}
        >
          {state.openChannels ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <Typography
          sx={{ fontWeight: 'bold', flexGrow: 1, cursor: 'pointer' }}
          variant="h5"
          onClick={() => dispatch({ type: 'OPEN_CHANNEL_LIST' })}
        >
          Channels
        </Typography>
        <IconButton
          aria-label="join channel"
          onClick={() => dispatch({ type: 'OPEN_JOIN_CHANNEL_DIALOG' })}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          aria-label="create channel"
          onClick={() => dispatch({ type: 'OPEN_CREATE_CHANNEL_DIALOG' })}
        >
          <AddIcon />
        </IconButton>
        <JoinChannelDialog
          open={state.openJoinChannelDialog}
          setOpen={() => dispatch({ type: 'OPEN_JOIN_CHANNEL_DIALOG' })}
          joinedChannels={channels}
          addChannel={addChannel}
        />
        <CreateChannelDialog
          open={state.openCreateChannelDialog}
          setOpen={() => dispatch({ type: 'OPEN_CREATE_CHANNEL_DIALOG' })}
          addChannel={addChannel}
        />
      </Stack>
      <Collapse in={state.openChannels}>
        <Stack pl={4} spacing={0.5}>
          {channels.map((channel) => (
            <ChannelListItem
              key={channel.id}
              channel={channel}
              selected={channel.id === selectedChannel?.id}
            />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default ChannelList;
