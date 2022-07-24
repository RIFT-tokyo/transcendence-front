import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Stack,
  Typography,
  Divider,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Axios from 'axios';
import { useEffect, useReducer } from 'react';
import { AuthApi, Password, UserApi } from '../../api/generated/api';
import TwoFactorDialog from './TwoFactorDialog';

type State = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isTwoFaEnabled: boolean;
  openDialog: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  isRequesting: boolean;
};

type Actions =
  | { type: 'SET_PASSWORDS'; payload: Partial<State> }
  | { type: 'SET_CURRENT_PASSWORD'; payload: string }
  | { type: 'SET_NEW_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'SET_IS_TWO_FA_ENABLED'; payload: boolean }
  | { type: 'OPEN_DIALOG' }
  | { type: 'SHOW_CURRENT_PASSWORD' }
  | { type: 'SHOW_NEW_PASSWORD' }
  | { type: 'SHOW_CONFIRM_PASSWORD' }
  | { type: 'LOADING' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_PASSWORDS':
      return { ...state, ...action.payload };
    case 'SET_CURRENT_PASSWORD':
      return { ...state, currentPassword: action.payload };
    case 'SET_NEW_PASSWORD':
      return { ...state, newPassword: action.payload };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
    case 'SET_IS_TWO_FA_ENABLED':
      return { ...state, isTwoFaEnabled: action.payload };
    case 'OPEN_DIALOG':
      return { ...state, openDialog: !state.openDialog };
    case 'SHOW_CURRENT_PASSWORD':
      return { ...state, showCurrentPassword: !state.showCurrentPassword };
    case 'SHOW_NEW_PASSWORD':
      return { ...state, showNewPassword: !state.showNewPassword };
    case 'SHOW_CONFIRM_PASSWORD':
      return { ...state, showConfirmPassword: !state.showCurrentPassword };
    case 'LOADING':
      return { ...state, isRequesting: !state.isRequesting };
    default:
      return state;
  }
};

const authApi = new AuthApi();
const userApi = new UserApi();

const SecuritySetting = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    isTwoFaEnabled: false,
    openDialog: false,
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    isRequesting: false,
  });

  const changePassword = async () => {
    if (state.isRequesting) {
      return;
    }
    if (
      !state.currentPassword ||
      !state.newPassword ||
      !state.confirmPassword ||
      state.newPassword !== state.confirmPassword
    ) {
      enqueueSnackbar('Please fill all fields correctly', { variant: 'error' });
      return;
    }
    const data: Password = {
      old_password: state.currentPassword,
      new_password: state.newPassword,
    };
    try {
      dispatch({ type: 'LOADING' });
      await authApi.putAuthPassword(data, { withCredentials: true });
      enqueueSnackbar('Password changed successfully', { variant: 'success' });
      dispatch({
        type: 'SET_PASSWORDS',
        payload: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
      });
    } catch (e: unknown) {
      if (Axios.isAxiosError(e) && e.response) {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'LOADING' });
  };

  const turnOffTwoFa = async () => {
    try {
      if (window.confirm('Really deactivate Two-factor?')) {
        await authApi.getAuth2faDeactivate({ withCredentials: true });
        dispatch({
          type: 'SET_IS_TWO_FA_ENABLED',
          payload: false,
        });
      }
    } catch (e: unknown) {
      if (Axios.isAxiosError(e) && e.response) {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    (async () => {
      dispatch({ type: 'LOADING' });
      try {
        const { data } = await userApi.getMe({ withCredentials: true });
        dispatch({
          type: 'SET_IS_TWO_FA_ENABLED',
          payload: data.is_two_fa_enabled!,
        });
      } catch (err: unknown) {
        if (Axios.isAxiosError(err) && err.response) {
          enqueueSnackbar(err.response.data.message, { variant: 'error' });
        }
      }
      dispatch({ type: 'LOADING' });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack bgcolor="background.paper" width={500}>
      <Stack padding={2} direction="column" spacing={1}>
        <Typography variant="h4">Security</Typography>
        <Divider />
        <Typography variant="h5">Change password</Typography>
        <Typography variant="h6">Current password</Typography>
        <TextField
          size="small"
          variant="outlined"
          label="current password"
          value={state.currentPassword}
          onChange={(e) =>
            dispatch({ type: 'SET_CURRENT_PASSWORD', payload: e.target.value })
          }
          type={state.showCurrentPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => dispatch({ type: 'SHOW_CURRENT_PASSWORD' })}
                edge="end"
              >
                {state.showCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Typography variant="h6">New password</Typography>
        <TextField
          size="small"
          variant="outlined"
          label="new password"
          value={state.newPassword}
          onChange={(e) =>
            dispatch({ type: 'SET_NEW_PASSWORD', payload: e.target.value })
          }
          type={state.showNewPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => dispatch({ type: 'SHOW_NEW_PASSWORD' })}
                edge="end"
              >
                {state.showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Typography variant="h6">Confirm password</Typography>
        <TextField
          size="small"
          variant="outlined"
          label="confirm password"
          value={state.confirmPassword}
          onChange={(e) =>
            dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })
          }
          type={state.showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => dispatch({ type: 'SHOW_CONFIRM_PASSWORD' })}
                edge="end"
              >
                {state.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={changePassword}>
          update password
        </Button>
        <Divider />
        <Typography variant="h5">Two-factor authentication</Typography>
        <Typography variant="body1">
          Two-factor authentication adds an additional layer of security to your
          account by requiring more than just a password to sign in.
        </Typography>
        {state.isRequesting ? null : (
          <Button
            variant={state.isTwoFaEnabled ? 'outlined' : 'contained'}
            color="primary"
            onClick={
              state.isTwoFaEnabled
                ? () => turnOffTwoFa()
                : () => dispatch({ type: 'OPEN_DIALOG' })
            }
          >
            {state.isTwoFaEnabled ? 'deactivate' : 'activate'}
          </Button>
        )}
        <TwoFactorDialog
          open={state.openDialog}
          setOpen={() => dispatch({ type: 'OPEN_DIALOG' })}
          turnOnIsTwoFaEnabled={() =>
            dispatch({ type: 'SET_IS_TWO_FA_ENABLED', payload: true })
          }
        />
      </Stack>
    </Stack>
  );
};

export default SecuritySetting;
