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
  | { type: 'channels'; value: Channel[] }
  | { type: 'selectChannel'; value: Channel | null }
  | { type: 'statusCode'; value: number };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'channels':
      return { ...state, channels: action.value };
    case 'selectChannel':
      return { ...state, selectedChannel: action.value };
    case 'statusCode':
      return { ...state, statusCode: action.value };
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
        dispatch({ type: 'selectChannel', value: null });
        return;
      }
      if (!channelId) {
        navigate(`${CHANNELS_URL}/${allChannel[0].id}`, { replace: true });
        return;
      }
      const channel = allChannel.find((c) => c.id?.toString() === channelId);
      if (channel) {
        dispatch({ type: 'selectChannel', value: channel });
      } else {
        dispatch({ type: 'statusCode', value: 404 });
      }
    },
    [channelId, navigate],
  );

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannels(undefined, undefined, {
        withCredentials: true,
      });
      dispatch({ type: 'channels', value: res.data });
      selectChannelFromURL(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'statusCode', value: err.response.status });
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
            addChannel={(channel) => dispatch({ type: 'channels', value: [...state.channels, channel] })}
          />
          <Divider orientation="vertical" flexItem variant="middle" />
          {state.selectedChannel && <Outlet context={{ channel: state.selectedChannel }} />}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
