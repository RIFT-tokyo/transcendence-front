import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Stack, Typography, Divider, TextField, Button, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { AuthApi, Password } from '../../api/generated/api';
// import useNotification from '../../hooks/notification';

const SecuritySetting = () => {
  const [currentPassword, setCurrentPassword] = React.useState<string>('');
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isRequesting, setIsRequesting] = React.useState(false);
  const authApi = new AuthApi();
  const { enqueueSnackbar } = useSnackbar();

  const changePassword = async () => {
    if (isRequesting) {
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
      enqueueSnackbar('Please fill all fields correctly', { variant: 'error' });
      return;
    }
    const data: Password = {
      old_password: currentPassword,
      new_password: newPassword,
    }
    try {
      setIsRequesting(true);
      await authApi.putAuthPassword(data, { withCredentials: true });
      enqueueSnackbar('Password changed successfully', { variant: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      enqueueSnackbar(e.response.data.message, { variant: 'error' });
    }
    setIsRequesting(false);
  }

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
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          type={showCurrentPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                edge="end"
              >
                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Typography variant="h6">New password</Typography>
        <TextField
          size="small"
          variant="outlined"
          label="new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          type={showNewPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowNewPassword(!showNewPassword)}
                edge="end"
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Typography variant="h6">Confirm password</Typography>
        <TextField
          size="small"
          variant="outlined"
          label="confirm password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={changePassword}
        >
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
