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
import { AuthApi } from '../../api/generated';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  turnOnIsTwoFaEnabled: () => void;
};

const TwoFactorDialog = (props: Props) => {
  const { open, setOpen, turnOnIsTwoFaEnabled } = props;
  const [authcode, setAuthcode] = useState('');
  const [qrcode, setQrcode] = useState('');
  const [errorAuthcode, setErrorAuthcode] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isQrcodeLoading, setIsQrcodeLoadingg] = useState(false);
  const authApi = new AuthApi();
  const { enqueueSnackbar } = useSnackbar();

  const closeDialog = () => {
    setAuthcode('');
    setErrorAuthcode(false);
    setOpen(false);
  };

  const isValidAuthcode = (twoFaAuthcode: string): boolean =>
    !!twoFaAuthcode && twoFaAuthcode.length === 6;

  const validateFields = (twoFaAuthcode: string): boolean => {
    setErrorAuthcode(!isValidAuthcode(twoFaAuthcode));
    return isValidAuthcode(twoFaAuthcode);
  };

  const submitAuthcode = async (twoFaAuthcode: string) => {
    if (!validateFields(twoFaAuthcode)) {
      return;
    }
    const twoFaActivate: { authcode: string } = { authcode: twoFaAuthcode };
    try {
      setIsRequesting(true);
      await authApi.postAuth2faActivate(twoFaActivate, {
        withCredentials: true,
      });
      turnOnIsTwoFaEnabled();
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

  const handleAuthcodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthcode(e.target.value);
  };

  useEffect(() => {
    if (open) {
      (async () => {
        setIsQrcodeLoadingg(true);
        try {
          const res = await authApi.getAuth2faQrcode({ withCredentials: true });
          setQrcode(res.data!.qrcode!);
        } catch (err: unknown) {
          if (Axios.isAxiosError(err) && err.response) {
            enqueueSnackbar(err.response.data.message, { variant: 'error' });
          }
        }
        setIsQrcodeLoadingg(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogTitle>Activate two-factor authentication</DialogTitle>
      <DialogContent>
        {isQrcodeLoading ? null : (
          <Box component="img" alt="The house from the offer." src={qrcode} />
        )}
        <TextField
          required
          autoFocus
          fullWidth
          margin="dense"
          id="code"
          label="Code (Generate by google authenticator)"
          value={authcode}
          disabled={isRequesting}
          onChange={handleAuthcodeChange}
          error={errorAuthcode}
          helperText={errorAuthcode ? 'Please enter 6 digits code' : undefined}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
        <Button
          onClick={() => submitAuthcode(authcode)}
          disabled={isRequesting}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoFactorDialog;
