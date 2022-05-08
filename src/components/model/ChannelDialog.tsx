import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { Channel, ChannelApi, NewChannel } from '../../api/generated';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  addChannel: (channel: Channel) => void;
};

const ChannelDialog = (props: Props) => {
  const { open, setOpen, addChannel } = props;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const channelApi = new ChannelApi();

  const createChannel = async (
    channelName: string,
    channelPassword: string,
  ) => {
    try {
      const newChannel: NewChannel = { name: channelName };
      if (password) {
        newChannel.password = channelPassword;
      }
      const res = await channelApi.postChannels(newChannel, {
        withCredentials: true,
      });
      addChannel(res.data);
      setName('');
      setPassword('');
      setOpen(false);
    } catch (err: any) {
      // TODO: error handling
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
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
          value={name}
          onChange={handleNameChange}
        />
        <TextField
          fullWidth
          margin="dense"
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => createChannel(name, password)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChannelDialog;
