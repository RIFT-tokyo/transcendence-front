import { List, ListItemButton, ListItemText } from '@mui/material';
import { useEffect, useReducer } from 'react';
import { Channel, ChannelApi, ChannelUser } from '../../api/generated';

type State = {
  channelUsers: ChannelUser[];
};

type Actions = { type: 'SET_CHANNEL_USERS'; payload: ChannelUser[] };

const reducer = (state: State, actions: Actions): State => {
  switch (actions.type) {
    case 'SET_CHANNEL_USERS':
      return { ...state, channelUsers: actions.payload };
    default: {
      return state;
    }
  }
};

type Props = {
  channel: Channel;
};

const channelApi = new ChannelApi();

const ModerationSettings = (props: Props) => {
  const { channel } = props;
  const [state, dispatch] = useReducer(reducer, {
    channelUsers: [],
  });

  useEffect(() => {
    const fetchChannelUserPermissions = async () => {
      if (!channel.id) {
        return;
      }
      const { data } = await channelApi.getChannelsUsersUserID(channel.id, {
        withCredentials: true,
      });
      dispatch({ type: 'SET_CHANNEL_USERS', payload: data });
    };
    fetchChannelUserPermissions();
  }, [channel.id]);

  return (
    <List>
      {state.channelUsers.map((channelUser) => (
        <ListItemButton>
          <ListItemText
            key={`channelUser-${channelUser.user?.id}`}
            primary={channelUser.user?.username ?? ''}
          />
        </ListItemButton>
      ))}
    </List>
  );
};

export default ModerationSettings;
