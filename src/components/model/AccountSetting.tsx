import {
  Avatar,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { VFC, ChangeEvent } from 'react';
import Axios from 'axios';
import { User } from '../../api/generated/api';
import { FileUploadApi } from '../../api/upload/fileUpload';
import ImageForm from '../ui/ImageForm';

type Props = {
  user: User;
  setUser: (user: User) => void;
  submit: () => void;
  reset: () => void;
};

const fileUploadApi = new FileUploadApi();

const AccountSetting: VFC<Props> = ({
  user,
  setUser,
  submit,
  reset,
}: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleChange =
    (prop: keyof User) => (event: ChangeEvent<HTMLInputElement>) => {
      setUser({ ...user, [prop]: event.target.value });
    };
  const saveImage = async (file: File) => {
    if (!user.id) {
      return;
    }
    try {
      const res = await fileUploadApi.postUsersUserIDImages(user.id, file, {
        withCredentials: true,
      });
      setUser({ ...user, profile_image: res.data.file_path });
      enqueueSnackbar('Profile image updated', { variant: 'success' });
    } catch (e: unknown) {
      if (Axios.isAxiosError(e) && e.response) {
        enqueueSnackbar('Failed to upload image', { variant: 'error' });
      }
    }
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
          value={user.username ?? ''}
          onChange={handleChange('username')}
        />
        <Typography variant="h6">Display Name</Typography>
        <TextField
          size="small"
          variant="outlined"
          value={user.display_name ?? ''}
          onChange={handleChange('display_name')}
        />
        <Typography variant="h6">Bio</Typography>
        <TextField
          size="small"
          variant="outlined"
          value={user.status_message ?? ''}
          onChange={handleChange('status_message')}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="medium"
          onClick={submit}
        >
          save
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="inherit"
          size="medium"
          onClick={reset}
        >
          reset
        </Button>
      </Stack>
    </Stack>
  );
};

export default AccountSetting;
