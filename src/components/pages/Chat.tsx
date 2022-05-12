import { Container, Divider, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Axios from 'axios';
import ChannelList from '../model/ChannelList';
import { Channel, ChannelApi } from '../../api/generated';
import ErrorRouter from '../ui/ErrorRouter';
import { CHANNELS_URL, CHAT_URL } from '../config/constants';

const channelApi = new ChannelApi();

const Chat = () => {
  const { channelId } = useParams();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [statusCode, setStatusCode] = useState<number>(0);
  const navigate = useNavigate();

  const setSelectedChannelFromChannels = useCallback(
    (allChannel: Channel[]) => {
      if (allChannel.length <= 0 && !channelId) {
        setSelectedChannel(null);
        return;
      }
      if (allChannel.length <= 0) {
        navigate(CHAT_URL, { replace: true });
        return;
      }
      if (!channelId) {
        navigate(`${CHANNELS_URL}/${allChannel[0].id}`, { replace: true });
        return;
      }
      const channel = allChannel.find((c) => c.id?.toString() === channelId);
      if (channel) {
        setSelectedChannel(channel);
      } else {
        setStatusCode(404);
      }
    },
    [channelId, navigate],
  );

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannels(undefined, undefined, {
        withCredentials: true,
      });
      setChannels(res.data);
      if (res.data.length <= 0) {
        return;
      }
      setSelectedChannelFromChannels(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        setStatusCode(err.response.status);
      }
    }
  };

  useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectedChannelFromChannels(channels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedChannelFromChannels]);

  return (
    <ErrorRouter statusCode={statusCode}>
      <Container component="main">
        <Stack direction="row" spacing={2} paddingX={2} paddingTop={2}>
          <ChannelList
            selectedChannel={selectedChannel}
            channels={channels}
            setChannels={setChannels}
          />
          <Divider orientation="vertical" flexItem variant="middle" />
          {selectedChannel && <Outlet context={{ channel: selectedChannel }} />}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
