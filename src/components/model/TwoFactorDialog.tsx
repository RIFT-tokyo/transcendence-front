import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Axios from 'axios';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { AuthApi, ChannelApi, NewChannel } from '../../api/generated';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const TwoFactorDialog = (props: Props) => {
  const { open, setOpen } = props;
  const [name, setName] = useState('');
  const [qrcode, setQrcode] = useState('');
  const [errorName, setErrorName] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const channelApi = new ChannelApi();
  const authApi = new AuthApi();
  const { enqueueSnackbar } = useSnackbar();

  const closeDialog = () => {
    setName('');
    setErrorName(false);
    setOpen(false);
  };

  const isValidName = (channelName: string): boolean => !!channelName;

  const validateFields = (channelName: string): boolean => {
    setErrorName(!isValidName(channelName));
    return isValidName(channelName);
  };

  const createChannel = async (channelName: string) => {
    if (!validateFields(channelName)) {
      return;
    }
    const newChannel: NewChannel = { name: channelName };
    try {
      setIsRequesting(true);
      const res = await channelApi.postChannels(newChannel, {
        withCredentials: true,
      });
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

  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.getAuth2faQrcode({ withCredentials: true });
        setQrcode(res.data!.qrcode!);
      } catch (err: unknown) {
        if (Axios.isAxiosError(err) && err.response) {
          enqueueSnackbar(err.response.data.message, { variant: 'error' });
        }
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Create a channel</DialogTitle>
      <DialogContent>
        <Box component="img" alt="The house from the offer." src={qrcode} />

        <TextField
          required
          autoFocus
          fullWidth
          margin="dense"
          id="code"
          label="Code (Generate by google authenticator)"
          value={name}
          disabled={isRequesting}
          onChange={handleNameChange}
          error={errorName}
          helperText={errorName ? 'Please fill Channel Name field' : undefined}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
        <Button onClick={() => createChannel(name)} disabled={isRequesting}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoFactorDialog;
