import { Avatar, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { User } from '../../api/generated';
import stringToColor from '../../functions/stringToColor';

type Props = {
  user: User;
  size: number;
};

const UserAvatar = (props: Props) => {
  const { user, size } = props;

  return (
    <Link component={NavLink} underline="none" to={`/users/${user.username}`}>
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
    </Link>
  );
};

export default UserAvatar;
