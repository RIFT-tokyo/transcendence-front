import {
  Button,
  Checkbox,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Fragment, useState } from 'react';
import { ChannelUser, Role } from '../../api/generated';
import UserAvatar from './UserAvatar';

type Props = {
  channelUsers: ChannelUser[];
  setPermission: (channelUsers: ChannelUser[]) => Promise<void>;
};

const RolesSettings = ({channelUsers, setPermission}: Props) => {

  const [channelUsersValue, setChannelUsersValue] = useState<ChannelUser[]>(channelUsers);

  const handleChannelUserClick = (userId: number | undefined) => {
    setChannelUsersValue((prev) => prev.map((channelUser) => {
        if (channelUser.user?.id !== userId) {
          return channelUser;
        }
        if (channelUser.role === Role.Administrator) {
          return {...channelUser, role: null};
        }
        return {...channelUser, role: Role.Administrator};
      }));
  };

   return (
    <>
      <List>
        {channelUsersValue
        .filter((channelUser) => channelUser.role !== Role.Owner)
        .map((channelUser) => (
          <Fragment key={`channelUser-${channelUser.user?.id}`}>
            <ListItemButton onClick={() => handleChannelUserClick(channelUser.user?.id)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={channelUser.role === Role.Administrator}
                  tabIndex={-1}
                />
              </ListItemIcon>
              {channelUser.user && (
                <ListItemAvatar>
                  <UserAvatar user={channelUser.user} size={28} />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={
                  channelUser.user?.display_name ??
                  channelUser.user?.username ??
                  ''
                }
              />
            </ListItemButton>
            <Divider />
          </Fragment>
        ))}
      </List>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="medium"
        onClick={() => {setPermission(channelUsersValue)}}
      >
        Update Administrator
      </Button>
    </>
  );
}

export default RolesSettings;
