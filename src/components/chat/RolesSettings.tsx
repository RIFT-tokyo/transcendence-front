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
import { Fragment, useEffect, useReducer } from 'react';
import { Channel, ChannelApi, ChannelUser, Role } from '../../api/generated';
import UserAvatar from './UserAvatar';

type State = {
  channelUsers: ChannelUser[];
  selectedUsers: boolean[];
  isLoading: boolean;
};

type Actions =
  | { type: 'SET_CHANNEL_USERS'; payload: ChannelUser[] }
  | { type: 'UPDATE_CHANNEL_USERS'; payload: ChannelUser[] }
  | { type: 'TOGGLE_SELECTED_USERS'; payload: number }
  | { type: 'SET_IS_LOADING'; payload: boolean };

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'SET_CHANNEL_USERS': {
      const channelUsers = action.payload.filter(
        (channelUser) => channelUser.role !== Role.Owner,
      );
      return {
        ...state,
        channelUsers,
        selectedUsers: channelUsers.map(
          (channelUser) => channelUser.role === Role.Administrator,
        ),
      };
    }
    case 'UPDATE_CHANNEL_USERS': {
      const { channelUsers } = state;
      action.payload.forEach((updatedChannelUser) => {
        const index = channelUsers.findIndex(
          (v) => v.user?.id === updatedChannelUser.user?.id,
        );
        channelUsers[index] = updatedChannelUser;
      });
      return { ...state, channelUsers };
    }
    case 'TOGGLE_SELECTED_USERS': {
      const { selectedUsers } = state;
      selectedUsers[action.payload] = !selectedUsers[action.payload];
      return { ...state, selectedUsers };
    }
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustivenessCheck: never = action;
      return state;
    }
  }
};

type Props = {
  channel: Channel;
};

const channelApi = new ChannelApi();

const RolesSettings = (props: Props) => {
  const { channel } = props;
  const [state, dispatch] = useReducer(reducer, {
    channelUsers: [],
    selectedUsers: [],
    isLoading: false,
  });

  const handleChannelUserClick = (index: number) => {
    dispatch({ type: 'TOGGLE_SELECTED_USERS', payload: index });
  };

  const findUpdatedUserIds = (selected: boolean) =>
    state.channelUsers
      .filter(
        (v, i) =>
          state.selectedUsers[i] === selected &&
          state.selectedUsers[i] !== (v.role === Role.Administrator),
      )
      .map((selectedUser) => selectedUser.user?.id)
      .filter((userId): userId is number => userId !== undefined);

  const handleUpdateAdministratorClick = async () => {
    if (!channel.id) {
      return;
    }
    const userIdsToRemoveRole = findUpdatedUserIds(false);
    const userIdsToAddRole = findUpdatedUserIds(true);
    console.log(
      state.channelUsers,
      state.selectedUsers,
      userIdsToRemoveRole,
      userIdsToAddRole,
    );

    const updateChannelUsersBody = [];
    if (userIdsToRemoveRole.length > 0) {
      updateChannelUsersBody.push({
        userIds: userIdsToRemoveRole,
        permission: { role: null },
      });
    }
    if (userIdsToAddRole.length > 0) {
      updateChannelUsersBody.push({
        userIds: userIdsToAddRole,
        permission: { role: Role.Administrator },
      });
    }
    if (updateChannelUsersBody.length > 0) {
      dispatch({ type: 'SET_IS_LOADING', payload: true });
      const { data } = await channelApi.putChannelsChannelIDUsers(
        channel.id,
        updateChannelUsersBody,
        { withCredentials: true },
      );
      dispatch({ type: 'UPDATE_CHANNEL_USERS', payload: data });
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    }
  };

  const canClickButton = () => {
    const initialSelectedUsers = state.channelUsers.map(
      (v) => v.role === Role.Administrator,
    );
    return (
      state.selectedUsers.some((v, i) => v !== initialSelectedUsers[i]) &&
      !state.isLoading
    );
  };

  useEffect(() => {
    const fetchChannelUserPermissions = async () => {
      if (!channel.id) {
        return;
      }
      dispatch({ type: 'SET_IS_LOADING', payload: true });
      const { data } = await channelApi.getChannelsUsersUserID(channel.id, {
        withCredentials: true,
      });
      dispatch({ type: 'SET_CHANNEL_USERS', payload: data });
      dispatch({ type: 'SET_IS_LOADING', payload: false });
    };
    fetchChannelUserPermissions();
  }, [channel.id]);

  if (state.channelUsers.length === 0) {
    return <div />;
  }

  return (
    <>
      <List>
        {state.channelUsers.map((channelUser, index) => (
          <Fragment key={`channelUser-${channelUser.user?.id}`}>
            <ListItemButton onClick={() => handleChannelUserClick(index)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={state.selectedUsers[index]}
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
        disabled={!canClickButton()}
        onClick={handleUpdateAdministratorClick}
      >
        Update Administrator
      </Button>
    </>
  );
};

export default RolesSettings;
