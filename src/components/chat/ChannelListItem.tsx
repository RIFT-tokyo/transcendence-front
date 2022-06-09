import { IconButton, Link, Stack, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from 'react-router-dom';
import { useReducer } from 'react';
import { Channel } from '../../api/generated';
import ChannelIcon from './ChannelIcon';
import ChannelSettingsDialog from './ChannelSettingsDialog';

type Props = {
  channel: Channel;
  selected: boolean;
};

type State = {
  openDialog: boolean;
};

type Actions = {
  type: 'TOGGLE_OPEN_DIALOG';
};

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'TOGGLE_OPEN_DIALOG':
      return { ...state, openDialog: !state.openDialog };
    default: {
      return state;
    }
  }
};

const ChannelListItem = (props: Props) => {
  const { channel, selected } = props;
  const [state, dispatch] = useReducer(reducer, {
    openDialog: false,
  });

  return (
    <Link
      component={NavLink}
      underline="none"
      to={`/chat/channels/${channel.id}`}
      color={selected ? undefined : 'inherit'}
    >
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ChannelIcon isProtected={channel.is_protected ?? false} />
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {channel.name}
        </Typography>
        <IconButton onClick={() => dispatch({ type: 'TOGGLE_OPEN_DIALOG' })}>
          <SettingsIcon />
        </IconButton>
        <ChannelSettingsDialog
          open={state.openDialog}
          setOpen={() => dispatch({ type: 'TOGGLE_OPEN_DIALOG' })}
        />
      </Stack>
    </Link>
  );
};

export default ChannelListItem;
