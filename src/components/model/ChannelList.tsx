import {
  Button,
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
import { Channel, ChannelApi } from '../../api/generated';

type Props = {
  selectedChannel: Channel | null;
  channels: Channel[];
  setChannels: Dispatch<SetStateAction<Channel[]>>;
};

const ChannelList = (props: Props) => {
  const { selectedChannel, channels, setChannels } = props;
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelPassword, setChannelPassword] = useState('');
  const channelApi = new ChannelApi();

  const addChannel = async (name: string) => {
    try {
      const res = await channelApi.postChannels(
        { name },
        { withCredentials: true },
      );
      setChannels([...channels, res.data]);
      setOpen(false);
    } catch (err: any) {
      // TODO: error handling
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const channelIcon = (isProtected: boolean) => {
    if (isProtected) {
      return <LockIcon />;
    }
    return <TagIcon />;
  };

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" width={220}>
        <Typography sx={{ fontWeight: 'bold', flexGrow: 1 }} variant="h5">
          Channels
        </Typography>
        <IconButton aria-label="create channel" onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
        <Dialog open={open} onClose={() => setOpen(false)}>
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
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              id="password"
              label="Password"
              value={channelPassword}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => addChannel(channelName)}>Create</Button>
          </DialogActions>
        </Dialog>
      </Stack>
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
  );
};

export default ChannelList;
