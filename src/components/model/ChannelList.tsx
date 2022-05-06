import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { Channel, ChannelApi, NewChannel } from '../../api/generated';

type Props = {
  selectedChannel: Channel | null;
  channels: Channel[];
  setChannels: Dispatch<SetStateAction<Channel[]>>;
};

const ChannelList = (props: Props) => {
  const { selectedChannel, channels, setChannels } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [openChannels, setOpenChannels] = useState(true);
  const [channelName, setChannelName] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const channelApi = new ChannelApi();

  const addChannel = async (name: string, password: string) => {
    try {
      const newChannel: NewChannel = { name };
      if (password) {
        newChannel.password = password;
      }
      const res = await channelApi.postChannels(newChannel, {
        withCredentials: true,
      });
      setChannels([...channels, res.data]);
      setChannelName('');
      setChannelPassword('');
      setOpenDialog(false);
    } catch (err: any) {
      // TODO: error handling
    }
  };

  const handleChannelNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const handleChannelPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChannelPassword(e.target.value);
  };

  const toggleOpenChannels = () => setOpenChannels(!openChannels);

  const channelIcon = (isProtected: boolean) => {
    if (isProtected) {
      return <LockIcon />;
    }
    return <TagIcon />;
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" width={220}>
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
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Create a channel</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              fullWidth
              margin="dense"
              id="name"
              label="Channel name"
              value={channelName}
              onChange={handleChannelNameChange}
            />
            <TextField
              fullWidth
              margin="dense"
              id="password"
              label="Password"
              value={channelPassword}
              onChange={handleChannelPasswordChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={() => addChannel(channelName, channelPassword)}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
      <Collapse in={openChannels}>
        <Stack pl={4}>
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
                <Typography variant="h6">{channel.name}</Typography>
              </Stack>
            </Link>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default ChannelList;
