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
import { useReducer } from 'react';
import { AuthApi, Password } from '../../api/generated/api';

type State = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  isRequesting: boolean;
};

type Actions =
  | { type: 'passwords'; value: Partial<State> }
  | { type: 'currentPassword'; value: string }
  | { type: 'newPassword'; value: string }
  | { type: 'confirmPassword'; value: string }
  | { type: 'showCurrentPassword'; value: boolean }
  | { type: 'showNewPassword'; value: boolean }
  | { type: 'showConfirmPassword'; value: boolean }
  | { type: 'isRequesting'; value: boolean };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'passwords':
      return { ...state, ...action.value };
    case 'currentPassword':
      return { ...state, currentPassword: action.value };
    case 'newPassword':
      return { ...state, newPassword: action.value };
    case 'confirmPassword':
      return { ...state, confirmPassword: action.value };
    case 'showCurrentPassword':
      return { ...state, showCurrentPassword: action.value };
    case 'showNewPassword':
      return { ...state, showNewPassword: action.value };
    case 'showConfirmPassword':
      return { ...state, showConfirmPassword: action.value };
    case 'isRequesting':
      return { ...state, isRequesting: action.value };
    default:
      return state;
  }
};

const authApi = new AuthApi();

const SecuritySetting = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(reducer, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
      dispatch({ type: 'isRequesting', value: true });
      await authApi.putAuthPassword(data, { withCredentials: true });
      enqueueSnackbar('Password changed successfully', { variant: 'success' });
      dispatch({ type: 'passwords', value: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }});
    } catch (e: unknown) {
      if (Axios.isAxiosError(e) && e.response) {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'isRequesting', value: false });
  };

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
          onChange={(e) => dispatch({ type: 'currentPassword', value: e.target.value })}
          type={state.showCurrentPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => dispatch({ type: 'showCurrentPassword', value: !state.showCurrentPassword })}
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
          onChange={(e) => dispatch({ type: 'newPassword', value: e.target.value })}
          type={state.showNewPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => dispatch({ type: 'showNewPassword', value: !state.showNewPassword })}
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
          onChange={(e) => dispatch({ type: 'confirmPassword', value: e.target.value })}
          type={state.showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => dispatch({ type: 'showConfirmPassword', value: !state.showConfirmPassword })}
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
        <Button variant="contained" color="primary">
          activate
        </Button>
      </Stack>
    </Stack>
  );
};

export default SecuritySetting;
