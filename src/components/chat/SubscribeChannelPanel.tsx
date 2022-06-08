import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { Channel } from '../../api/generated';

type Props = {
  channels: Channel[];
};

const channelIcon = (isProtected: boolean) => {
  if (isProtected) {
    return <LockIcon />;
  }
  return <TagIcon />;
};

const SubscribeChannelPanel = (props: Props) => {
  const { channels } = props;

  return (
    <List sx={{ height: 330, overflowY: 'auto', pt: 0 }}>
      {channels.map((channel) => (
        <>
          <ListItem disablePadding key={`list-${channel.id}`}>
            <ListItemButton>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {channelIcon(channel.is_protected ?? false)}
                <Typography variant="h6" noWrap>
                  {channel.name}
                </Typography>
              </Stack>
            </ListItemButton>
          </ListItem>
          <Divider key={`divider-${channel.id}`} />
        </>
      ))}
    </List>
  );
};

export default SubscribeChannelPanel;
