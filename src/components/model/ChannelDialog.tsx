import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Axios from 'axios';
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
  const [errorName, setErrorName] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const channelApi = new ChannelApi();
  const { enqueueSnackbar } = useSnackbar();

  const closeDialog = () => {
    setName('');
    setPassword('');
    setErrorName(false);
    setErrorPassword(false);
    setOpen(false);
  };

  const isValidName = (channelName: string): boolean => !!channelName;
  const isValidPassword = (channelPassword: string): boolean =>
    !isPrivate || !!channelPassword;

  const validateFields = (
    channelName: string,
    channelPassword: string,
  ): boolean => {
    setErrorName(!isValidName(channelName));
    setErrorPassword(!isValidPassword(channelPassword));
    return isValidName(channelName) && isValidPassword(channelPassword);
  };

  const createChannel = async (
    channelName: string,
    channelPassword: string,
  ) => {
    if (!validateFields(channelName, channelPassword)) {
      return;
    }
    const newChannel: NewChannel = { name: channelName };
    if (isPrivate && password) {
      newChannel.password = channelPassword;
    }
    try {
      setIsRequesting(true);
      const res = await channelApi.postChannels(newChannel, {
        withCredentials: true,
      });
      addChannel(res.data);
      closeDialog();
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response?.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      } else if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    setIsRequesting(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleIsPrivateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(e.target.checked);
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
          label="Channel Name"
          value={name}
          disabled={isRequesting}
          onChange={handleNameChange}
          error={errorName}
          helperText={errorName ? 'Please fill Channel Name field' : undefined}
        />
        <FormControlLabel
          sx={{ display: 'flex', justifyContent: 'space-between' }}
          control={
            <Switch checked={isPrivate} onChange={handleIsPrivateChange} />
          }
          label="Private Channel"
          labelPlacement="start"
        />
        <Collapse in={isPrivate}>
          <TextField
            fullWidth
            margin="dense"
            id="password"
            label="Channel Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            disabled={isRequesting || !isPrivate}
            onChange={handlePasswordChange}
            error={errorPassword}
            helperText={
              errorPassword ? 'Please fill Channel Password field' : undefined
            }
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
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
        <Button
          onClick={() => createChannel(name, password)}
          disabled={isRequesting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChannelDialog;
