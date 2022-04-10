import { Avatar, Divider, Stack, TextField, Typography } from '@mui/material';
import { VFC, ChangeEvent } from 'react';
import { User } from '../../api/generated/api';
import { FileUploadApi } from '../../api/upload/fileUpload';
import ImageForm from '../ui/ImageForm';

type Props = {
  user: User;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User) => void;
};

const AccountSetting: VFC<Props> = ({ user, setUser }: Props) => {
  const fileUploadApi = new FileUploadApi();
  const usernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      username: e.target.value,
    });
  };
  const displayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      display_name: e.target.value,
    });
  };
  const statusMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      status_message: e.target.value,
    });
  };
  const saveImage = async (file: File) => {
    if (!user.id) {
      return;
    }
    const res = await fileUploadApi.postUsersUserIDImages(user.id, file, {
      withCredentials: true,
    });
    setUser({ ...user, profile_image: res.data.file_path });
  };

  return (
    <Stack bgcolor="background.paper" width={500}>
      <Stack padding={2} direction="column" spacing={1}>
        <Typography variant="h4">Account</Typography>
        <Divider />
        <Typography variant="h6">Profile Image</Typography>
        <Avatar sx={{ width: 296, height: 296 }} src={user.profile_image} />
        <ImageForm saveImage={saveImage} />
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
