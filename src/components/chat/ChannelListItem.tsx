import { Link, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Channel } from '../../api/generated';
import ChannelIcon from './ChannelIcon';

type Props = {
  channel: Channel;
  selected: boolean;
};

const ChannelListItem = (props: Props) => {
  const { channel, selected } = props;

  return (
    <Link
      component={NavLink}
      underline="none"
      to={`/chat/channels/${channel.id}`}
      color={selected ? undefined : 'inherit'}
    >
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <ChannelIcon isProtected={channel.is_protected ?? false} />
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {channel.name}
        </Typography>
      </Stack>
    </Link>
  );
};

export default ChannelListItem;
