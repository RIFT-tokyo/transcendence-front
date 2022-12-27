import { Container, Divider, Stack, Typography } from '@mui/material';
import { useContext, useEffect, useReducer } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import ChannelList from '../chat/ChannelList';
import {
  BlockApi,
  Channel,
  ChannelApi,
  PmApi,
  User,
} from '../../api/generated';
import ErrorRouter from '../ui/ErrorRouter';
import { CHANNELS_URL, PMS_URL } from '../config/constants';
import PMList from '../chat/PMList';
import { AuthContext } from '../../contexts/AuthContext';
import UserAvatar from '../model/UserAvatar';

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
      return {
        ...state,
        channels: action.payload,
        selectedChannel: action.payload.find((channel) => channel.id === state.selectedChannel?.id) ?? null
      };
    case 'SET_PM_USERS':
      return { ...state, pmUsers: action.payload };
    case 'SET_BLOCK_USER_IDS':
      return { ...state, blockUserIds: action.payload };
    case 'SELECT_CHANNEL':
      return {
        ...state,
        selectedChannel: action.payload,
        selectedPmUser: null,
      };
    case 'SELECT_PM_USER':
      return {
        ...state,
        selectedPmUser: action.payload,
        selectedChannel: null,
      };
    case 'SET_STATUS_CODE':
      return { ...state, statusCode: action.payload };
    default:
      return state;
  }
};

const channelApi = new ChannelApi();
const pmApi = new PmApi();
const blockApi = new BlockApi();

const chatIcon = (toUser: User | null, isProtected: boolean) => {
  if (toUser) {
    return <UserAvatar user={toUser} size={20} />
  }
  if (isProtected) {
    return <LockIcon />;
  }
  return <TagIcon />;
};

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

  const openChatFromURL = async (
    channelIdValue: string | undefined,
    toUserIdValue: string | undefined,
    allChannel: Channel[],
    allPmUsers: User[],
  ) => {
    if (channelIdValue) {
      const channel = allChannel.find(
        (c) => c.id?.toString() === channelIdValue,
      );
      if (channel) {
        dispatch({ type: 'SELECT_CHANNEL', payload: channel });
      } else {
        dispatch({ type: 'SET_STATUS_CODE', payload: 404 });
      }
    } else if (toUserIdValue) {
      const pmUser = allPmUsers.find((u) => u.id?.toString() === toUserIdValue);
      if (pmUser) {
        dispatch({ type: 'SELECT_PM_USER', payload: pmUser });
      } else {
        try {
          const res = await pmApi.putMePmsUserid(Number(toUserIdValue), {
            withCredentials: true,
          });
          dispatch({
            type: 'SET_PM_USERS',
            payload: [...allPmUsers, res.data],
          });
          dispatch({ type: 'SELECT_PM_USER', payload: res.data });
        } catch (err: unknown) {
          if (Axios.isAxiosError(err) && err.response) {
            dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
          }
        }
      }
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
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      }
    }
  };

  const fetchBlockUserIds = async () => {
    try {
      const res = await blockApi.getUsersUserIDBlock(authUser!.id!, {
        withCredentials: true,
      });
      dispatch({
        type: 'SET_BLOCK_USER_IDS',
        payload: res.data.map((u) => u.id!),
      });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      }
    }
  };

  const exitChannel = async () => {
    try {
      const res = await blockApi.getUsersUserIDBlock(authUser!.id!, {
        withCredentials: true,
      });
      dispatch({
        type: 'SET_BLOCK_USER_IDS',
        payload: res.data.map((u) => u.id!),
      });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      }
    }
  }

  useEffect(() => {
    (async () => {
      await fetchBlockUserIds();
      await fetchChannels();
      await fetchPMs();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!channelId && !toUserId) {
      if (state.channels.length > 0) {
        navigate(`${CHANNELS_URL}/${state.channels[0].id}`, {
          replace: true,
        });
      } else if (state.pmUsers.length > 0) {
        navigate(`${PMS_URL}/${state.pmUsers[0].id}`, {
          replace: true,
        });
      }
    }
    if (
      (state.channels.length > 0 && channelId) ||
      (state.pmUsers.length > 0 && toUserId)
    ) {
      openChatFromURL(channelId, toUserId, state.channels, state.pmUsers);
    }
  }, [channelId, toUserId, state.channels, state.pmUsers, navigate]);

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
              updateChannels={(channels) => {
                dispatch({ type: 'SET_CHANNELS', payload: channels });
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
            <Stack width={880}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                paddingBottom={1.5}
                justifyContent='space-between'
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  paddingBottom={1.5}
                >
                  {chatIcon(state.selectedPmUser, state.selectedChannel?.is_protected ?? false)}
                  <Typography sx={{ fontWeight: 'bold' }} variant="h5">
                    {state.selectedPmUser ? state.selectedPmUser.username : state.selectedChannel?.name}
                  </Typography>
                </Stack>
                {
                  state.selectedChannel &&
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    paddingBottom={1.5}
                    onClick={() => exitChannel()}
                  >
                    <LogoutIcon/>
                  </Stack>
                }
              </Stack>
              <Outlet
                context={{
                  channel: state.selectedChannel,
                  toUser: state.selectedPmUser,
                  blockUserIds: state.blockUserIds,
                }}
              />
            </Stack>
          )}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
