import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  const [showPassword, setShowPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const channelApi = new ChannelApi();

  const closeDialog = () => {
    setName('');
    setPassword('');
    setErrorPassword(false);
    setOpen(false);
  };

  const createChannel = async (
    channelName: string,
    channelPassword: string,
  ) => {
    if (!channelName) {
      setErrorPassword(true);
      return;
    }
    try {
      const newChannel: NewChannel = { name: channelName };
      if (password) {
        newChannel.password = channelPassword;
      }
      const res = await channelApi.postChannels(newChannel, {
        withCredentials: true,
      });
      addChannel(res.data);
      closeDialog();
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
          error={errorPassword}
          helperText={
            errorPassword ? 'Please fill Channel name field' : undefined
          }
        />
        <TextField
          fullWidth
          margin="dense"
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
        <Button onClick={() => createChannel(name, password)}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChannelDialog;
