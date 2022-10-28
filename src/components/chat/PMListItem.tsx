import { Link, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { User } from '../../api/generated';
import { PMS_URL } from '../config/constants';
import UserAvatar from '../model/UserAvatar';

type Props = {
  pmUser: User;
  selected: boolean;
};

const PMListItem = (props: Props) => {
  const { pmUser, selected } = props;

  return (
    <Link
      component={NavLink}
      underline="none"
      to={`${PMS_URL}/${pmUser.id}`}
      color={selected ? undefined : 'inherit'}
    >
      { /* TODO: tooltipでblockを実装する */ }
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <UserAvatar user={pmUser} size={20} />
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {pmUser.username}
        </Typography>
      </Stack>
    </Link>
  );
};

export default PMListItem;
