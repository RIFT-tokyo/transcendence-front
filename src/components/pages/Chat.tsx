import { Container, Divider, Stack } from '@mui/material';
import { useCallback, useContext, useEffect, useReducer } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import ChannelList from '../chat/ChannelList';
import { BlockApi, Channel, ChannelApi, PmApi, User } from '../../api/generated';
import ErrorRouter from '../ui/ErrorRouter';
import { CHANNELS_URL, PMS_URL } from '../config/constants';
import PMList from '../chat/PMList';
import { AuthContext } from '../../contexts/AuthContext';

type State = {
  channels: Channel[];
  pmUsers: User[];
  blockUserIds: number[];
  selectedChannel: Channel | null;
  selectedPmUser: User | null;
  statusCode: number;
};

type Actions =
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'SELECT_CHANNEL'; payload: Channel | null }
  | { type: 'SELECT_PM_USER'; payload: User | null }
  | { type: 'SET_PM_USERS'; payload: User[] }
  | { type: 'SET_BLOCK_USER_IDS'; payload: number[] }
  | { type: 'SET_STATUS_CODE'; payload: number };

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };
    case 'SET_PM_USERS':
      return { ...state, pmUsers: action.payload };
    case 'SET_BLOCK_USER_IDS':
      return { ...state, blockUserIds: action.payload };
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
const blockApi = new BlockApi();

const Chat = () => {
  const { channelId, toUserId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, {
    channels: [],
    pmUsers: [],
    blockUserIds: [],
    selectedChannel: null,
    selectedPmUser: null,
    statusCode: 0,
  });

  const openChatFromURL =
    (channelIdValue: string | undefined, toUserIdValue: string | undefined, allChannel: Channel[], allPmUsers: User[]) => {
      if (!channelIdValue && !toUserIdValue) {
        if (allChannel.length > 0) {
          navigate(`${CHANNELS_URL}/${allChannel[0].id}`, {
            replace: true,
          });
          dispatch({ type: 'SELECT_CHANNEL', payload: allChannel[0] });
          return;
        }
        if (allPmUsers.length > 0) {
          navigate(`${PMS_URL}/${allPmUsers[0].id}`, {
            replace: true,
          });
          dispatch({ type: 'SELECT_PM_USER', payload: allPmUsers[0] });
          return;
        }
        return;
      }
      if (channelIdValue) {
        const channel = allChannel.find((c) => c.id?.toString() === channelIdValue);
        dispatch({ type: 'SELECT_CHANNEL', payload: channel ?? null });
      } else if (toUserIdValue) {
        const pmUser = allPmUsers.find((u) => u.id?.toString() === toUserIdValue);
        dispatch({ type: 'SELECT_PM_USER', payload: pmUser ?? null });
      } else {
        dispatch({ type: 'SET_STATUS_CODE', payload: 404 });
      }
    };

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannelsMe({ withCredentials: true });
      dispatch({ type: 'SET_CHANNELS', payload: res.data });
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

  const fetchBlockUserIds = async () => {
    try {
      const res = await blockApi.getUsersUserIDBlock(authUser!.id!, {withCredentials: true});
      dispatch({ type: 'SET_BLOCK_USER_IDS', payload: res.data.map((u) => u.id!) });
    } catch (err: unknown) {
      // if (Axios.isAxiosError(err) && err.response) {
      //   dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      // }
    }
  }

  useEffect(() => {
    (async () => {
      await fetchBlockUserIds();
      await fetchChannels();
      await fetchPMs();
      openChatFromURL(channelId, toUserId, state.channels, state.pmUsers);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.channels.length > 0 || state.pmUsers.length > 0) {
      openChatFromURL(channelId, toUserId, state.channels, state.pmUsers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, toUserId, state.channels, state.pmUsers]);

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
            <Outlet context={{ channel: state.selectedChannel, toUser: state.selectedPmUser, blockUserIds: state.blockUserIds }} />
          )}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
