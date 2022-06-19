import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';
import { Channel } from '../../api/generated';
import ChannelIcon from './ChannelIcon';

type Props = {
  channels: Channel[];
  selectedChannel: Channel | null;
  handleClick: (channel: Channel) => void;
};

const JoinChannelDialogList = (props: Props) => {
  const { channels, selectedChannel, handleClick } = props;

  if (channels.length === 0) {
    return (
      <>
        <Typography>There are no channels to join.</Typography>
        <Typography>Create a channel from the + button.</Typography>
      </>
    );
  }

  return (
    <List sx={{ maxHeight: 330, overflowY: 'auto', pt: 0 }}>
      {channels.map((channel) => (
        <Fragment key={`channel-list-${channel.id}`}>
          <ListItem disablePadding>
            <ListItemButton
              selected={channel.id === selectedChannel?.id}
              onClick={() => handleClick(channel)}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                width="100%"
              >
                <ChannelIcon isProtected={channel.is_protected ?? false} />
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
  );
};

export default JoinChannelDialogList;
