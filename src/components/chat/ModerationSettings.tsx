import { Button, Checkbox, Divider, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { ChannelUser, Role } from '../../api/generated';
import UserAvatar from '../model/UserAvatar';

type Props = {
  role: Role | null | undefined;
  channelUsers: ChannelUser[];
  setPermission: (channelUsers: ChannelUser[]) => Promise<void>;
};

const ModerationSettings = ({role, channelUsers, setPermission}: Props) => {

  const [channelUsersValue, setChannelUsersValue] = useState<ChannelUser[]>(channelUsers.filter((channelUser) => !channelUser.is_ban));

  const handleChannelUserClick = (userId: number | undefined) => {
    setChannelUsersValue((prev) => prev.map((channelUser) => {
        if (channelUser.user?.id !== userId) {
          return channelUser;
        }
        return {...channelUser, is_ban: !channelUser.is_ban}
      }));
  };

  useEffect(() => {
    setChannelUsersValue(channelUsers.filter((channelUser) => !channelUser.is_ban));
  }, [channelUsers]);

   return (
    <>
      <List>
        {channelUsersValue
        .filter((channelUser) => {
          if (role === Role.Owner) {
            return channelUser.role !== Role.Owner
          }
          return !channelUser.role
        })
        .map((channelUser) => (
          <Fragment key={`channelUser-${channelUser.user?.id}`}>
            <ListItemButton onClick={() => handleChannelUserClick(channelUser.user?.id)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={channelUser.is_ban}
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
        color="warning"
        size="medium"
        onClick={() => {setPermission(channelUsersValue)}}
      >
        Ban Users
      </Button>
    </>
  );
}
export default ModerationSettings;
