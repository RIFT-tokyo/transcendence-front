import { Container, Divider, Stack } from '@mui/material';
import { useCallback, useEffect, useReducer } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import ChannelList from '../chat/ChannelList';
import { Channel, ChannelApi, PmApi, User } from '../../api/generated';
import ErrorRouter from '../ui/ErrorRouter';
import { CHANNELS_URL, PMS_URL } from '../config/constants';
import PMList from '../chat/PMList';

type State = {
  channels: Channel[];
  pmUsers: User[];
  selectedChannel: Channel | null;
  selectedPmUser: User | null;
  statusCode: number;
};

type Actions =
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'SELECT_CHANNEL'; payload: Channel | null }
  | { type: 'SELECT_PM_USER'; payload: User | null }
  | { type: 'SET_PM_USERS'; payload: User[] }
  | { type: 'SET_STATUS_CODE'; payload: number };

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };
    case 'SET_PM_USERS':
      return { ...state, pmUsers: action.payload };
    case 'SELECT_CHANNEL':
      return { ...state, selectedChannel: action.payload, selectedPmUser: null };
    case 'SELECT_PM_USER':
      return { ...state, selectedPmUser: action.payload, selectedChannel: null };
    case 'SET_STATUS_CODE':
      return { ...state, statusCode: action.payload };
    default:
      return state;
  }
};

const channelApi = new ChannelApi();
const pmApi = new PmApi();

const Chat = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    channels: [],
    pmUsers: [],
    selectedChannel: null,
    selectedPmUser: null,
    statusCode: 0,
  });

  const selectChannelFromURL = useCallback(
    (allChannel: Channel[]) => {
      if (allChannel.length <= 0 && !channelId) {
        dispatch({ type: 'SELECT_CHANNEL', payload: null });
        return;
      }
      if (!channelId && allChannel[0].id) {
        navigate(`${CHANNELS_URL}/${allChannel[0].id}`, {
          replace: true,
        });
        return;
      }
      const channel = allChannel.find((c) => c.id?.toString() === channelId);
      if (channel) {
        dispatch({ type: 'SELECT_CHANNEL', payload: channel });
      } else {
        dispatch({ type: 'SET_STATUS_CODE', payload: 404 });
      }
    },
    [channelId, navigate],
  );

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannelsMe({ withCredentials: true });
      dispatch({ type: 'SET_CHANNELS', payload: res.data });
      selectChannelFromURL(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      }
    }
  };

  const fetchPMs = async () => {
    try {
      const res = await pmApi.getMePms({ withCredentials: true });
      dispatch({ type: 'SET_PM_USERS', payload: res.data });
    } catch (err: unknown) {
      // if (Axios.isAxiosError(err) && err.response) {
      //   dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      // }
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchPMs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.channels.length > 0) {
      selectChannelFromURL(state.channels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectChannelFromURL]);

  return (
    <ErrorRouter statusCode={state.statusCode}>
      <Container component="main">
        <Stack direction="row" spacing={2} paddingX={2} paddingTop={2}>
          <div>
            <ChannelList
              selectedChannel={state.selectedChannel}
              channels={state.channels}
              addChannel={(channel) => {
                dispatch({
                  type: 'SET_CHANNELS',
                  payload: [...state.channels, channel],
                });
                navigate(`${CHANNELS_URL}/${channel.id}`);
                // localhost/chat/channel/{id}
                // localhost/chat/pm/
              }}
            />
            <PMList
              selectedUser={state.selectedPmUser}
              pmUsers={state.pmUsers}
              addUser={(user) => {
                dispatch({
                  type: 'SET_PM_USERS',
                  payload: [...state.pmUsers, user],
                });
                navigate(`${PMS_URL}/${user.id}`);
              }}
            />
          </div>
          <Divider orientation="vertical" flexItem variant="middle" />
          {(state.selectedChannel || state.selectedPmUser) && (
            <Outlet context={{ channel: state.selectedChannel, toUser: state.selectedPmUser }} />
          )}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
