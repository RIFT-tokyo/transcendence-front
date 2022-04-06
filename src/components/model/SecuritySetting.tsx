import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Stack, Typography, Divider, TextField, Button, IconButton } from '@mui/material';
import * as React from 'react';
import { AuthApi, Password } from '../../api/generated/api';

const SecuritySetting = () => {
  const [currentPassword, setOldPassword] = React.useState<string | null>(null);
  const [newPassword, setNewPassword] = React.useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = React.useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const authApi = new AuthApi();

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
      alert('正しく入力してください');
      return;
    }
    const data: Password = {
      old_password: currentPassword,
      new_password: newPassword,
    }
    try {
      await authApi.putAuthPassword(data, { withCredentials: true });
    } catch (e) {
      alert('パスワードの更新に失敗しました');
    }
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
          onChange={e => setOldPassword(e.target.value)}
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
