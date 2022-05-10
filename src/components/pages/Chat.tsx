import { Container, Divider, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import ChannelList from '../model/ChannelList';
import { Channel, ChannelApi } from '../../api/generated';
import MessageList from '../model/MessageList';
import ErrorRouter from '../ui/ErrorRouter';

const channelApi = new ChannelApi();

const Chat = () => {
  const { channelId } = useParams();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [statusCode, setStatusCode] = useState<number>(0);
  const setSelectedChannelFromChannels = useCallback(
    (allChannel: Channel[]) => {
      if (allChannel.length <= 0 && !channelId) {
        return;
      }
      if (channelId) {
        const channel = allChannel.find((c) => c.id?.toString() === channelId);
        if (channel) {
          setSelectedChannel(channel);
        } else {
          setStatusCode(404);
        }
      } else {
        setSelectedChannel(allChannel[0]);
      }
    },
    [channelId],
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
  }, [setSelectedChannelFromChannels, channels]);

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
          {selectedChannel && <MessageList channel={selectedChannel} />}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
