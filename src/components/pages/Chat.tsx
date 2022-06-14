import { Container, Divider, Stack } from '@mui/material';
import { useCallback, useEffect, useReducer } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import ChannelList from '../model/ChannelList';
import { Channel, ChannelApi } from '../../api/generated';
import ErrorRouter from '../ui/ErrorRouter';
import { CHANNELS_URL } from '../config/constants';

type State = {
  channels: Channel[];
  selectedChannel: Channel | null;
  statusCode: number;
};

type Actions =
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'SELECT_CHANNEL'; payload: Channel | null }
  | { type: 'SET_STATUS_CODE'; payload: number };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };
    case 'SELECT_CHANNEL':
      return { ...state, selectedChannel: action.payload };
    case 'SET_STATUS_CODE':
      return { ...state, statusCode: action.payload };
    default:
      return state;
  }
};

const channelApi = new ChannelApi();

const Chat = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    channels: [],
    selectedChannel: null,
    statusCode: 0,
  });

  const selectChannelFromURL = useCallback(
    (allChannel: Channel[]) => {
      if (allChannel.length <= 0 && !channelId) {
        dispatch({ type: 'SELECT_CHANNEL', payload: null });
        return;
      }
      if (!channelId) {
        navigate(`${CHANNELS_URL}/${allChannel[0].id}`, { replace: true });
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
      const res = await channelApi.getChannels(undefined, undefined, {
        withCredentials: true,
      });
      dispatch({ type: 'SET_CHANNELS', payload: res.data });
      selectChannelFromURL(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      }
    }
  };

  useEffect(() => {
    fetchChannels();
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
          <ChannelList
            selectedChannel={state.selectedChannel}
            channels={state.channels}
            addChannel={(channel) =>
              dispatch({
                type: 'SET_CHANNELS',
                payload: [...state.channels, channel],
              })
            }
          />
          <Divider orientation="vertical" flexItem variant="middle" />
          {state.selectedChannel && (
            <Outlet context={{ channel: state.selectedChannel }} />
          )}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
