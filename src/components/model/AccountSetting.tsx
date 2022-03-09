import { Avatar, Divider, Stack, TextField, Typography } from '@mui/material';
import { User } from '../../api/generated/api';

type Props = {
  user: User;
  setUser: (user: User) => void;
};

const AccountSetting: React.VFC<Props> = ({ user, setUser }) => {
  const usernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      username: e.target.value,
    });
  };
  const displayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      display_name: e.target.value,
    });
  };
  const statusMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      status_message: e.target.value,
    });
  };

  return (
    <Stack bgcolor="background.paper" width={500}>
      <Stack padding={2} direction="column" spacing={1}>
        <Typography variant="h4">Account</Typography>
        <Divider />
        <Typography variant="h6">Profile Image</Typography>
        <Avatar sx={{ width: 296, height: 296 }} src={user.profile_image} />
        <Typography variant="h6">Username</Typography>
        <TextField
          size="small"
          variant="outlined"
          value={user.username}
          onChange={usernameChange}
        />
        <Typography variant="h6">Display Name</Typography>
        <TextField
          size="small"
          variant="outlined"
          value={user.display_name}
          onChange={displayNameChange}
        />
        <Typography variant="h6">Bio</Typography>
        <TextField
          size="small"
          variant="outlined"
          value={user.status_message}
          onChange={statusMessageChange}
        />
      </Stack>
    </Stack>
  );
};

export default AccountSetting;
