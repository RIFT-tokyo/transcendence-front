import { Avatar } from '@mui/material';
import { User } from '../../api/generated';
import stringToColor from '../../functions/stringToColor';

type Props = {
  user: User;
  size: number;
};

const UserAvatar = (props: Props) => {
  const { user, size } = props;

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: user?.profile_image
          ? undefined
          : stringToColor(user?.username ?? ''),
      }}
      src={user?.profile_image}
    >
      {user?.username?.slice(0, 2) ?? ''}
    </Avatar>
  );
};

export default UserAvatar;
