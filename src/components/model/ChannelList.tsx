import {
  Collapse,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { Dispatch, SetStateAction, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Channel } from '../../api/generated';
import ChannelDialog from './ChannelDialog';

type Props = {
  selectedChannel: Channel | null;
  channels: Channel[];
  setChannels: Dispatch<SetStateAction<Channel[]>>;
};

const ChannelList = (props: Props) => {
  const { selectedChannel, channels, setChannels } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [openChannels, setOpenChannels] = useState(true);

  const toggleOpenChannels = () => setOpenChannels(!openChannels);

  const addChannel = (channel: Channel) => setChannels([...channels, channel]);

  const channelIcon = (isProtected: boolean) => {
    if (isProtected) {
      return <LockIcon />;
    }
    return <TagIcon />;
  };

  return (
    <Stack direction="column" spacing={0.5} width={220}>
      <Stack direction="row" alignItems="center">
        <IconButton
          aria-label="Toggle channel visibility"
          onClick={toggleOpenChannels}
        >
          {openChannels ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <Typography
          sx={{ fontWeight: 'bold', flexGrow: 1 }}
          variant="h5"
          onClick={toggleOpenChannels}
        >
          Channels
        </Typography>
        <IconButton
          aria-label="create channel"
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </IconButton>
        <ChannelDialog
          open={openDialog}
          setOpen={setOpenDialog}
          addChannel={addChannel}
        />
      </Stack>
      <Collapse in={openChannels}>
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
