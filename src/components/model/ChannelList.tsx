import { Collapse, IconButton, Link, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { useReducer } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Channel } from '../../api/generated';
import ChannelDialog from './ChannelDialog';

type Props = {
  selectedChannel: Channel | null;
  channels: Channel[];
  addChannel: (channel: Channel) => void;
};

type State = {
  openDialog: boolean;
  openChannels: boolean;
};

type Actions =
  | { type: 'OPEN_DIALOG' }
  | { type: 'OPEN_CHANNEL_LIST' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, openDialog: !state.openDialog };
    case 'OPEN_CHANNEL_LIST':
      return { ...state, openChannels: !state.openChannels };
    default:
      return state;
  }
};

const ChannelList = (props: Props) => {
  const { selectedChannel, channels, addChannel } = props;

  const [state, dispatch] = useReducer(reducer, {
    openDialog: false,
    openChannels: true,
  });

  const channelIcon = (isProtected: boolean) => {
    if (isProtected) {
      return <LockIcon />;
    }
    return <TagIcon />;
  };

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
          aria-label="create channel"
          onClick={() => dispatch({ type: 'OPEN_DIALOG' })}
        >
          <AddIcon />
        </IconButton>
        <ChannelDialog
          open={state.openDialog}
          setOpen={() => dispatch({ type: 'OPEN_DIALOG' })}
          addChannel={addChannel}
        />
      </Stack>
      <Collapse in={state.openChannels}>
        <Stack pl={4} spacing={0.5}>
          {channels.map((channel) => (
            <Link
              key={channel.id}
              component={NavLink}
              underline="none"
              to={`/chat/channels/${channel.id}`}
              color={channel.id === selectedChannel?.id ? undefined : 'inherit'}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {channelIcon(channel.is_protected ?? false)}
                <Typography variant="h6" noWrap>
                  {channel.name}
                </Typography>
              </Stack>
            </Link>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default ChannelList;
