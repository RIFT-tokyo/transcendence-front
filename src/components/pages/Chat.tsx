import { Container, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChannelList from '../model/ChannelList';
import { Channel, ChannelApi } from '../../api/generated';
import MessageList from '../model/MessageList';
import ErrorRouter from '../ui/ErrorRouter';

const Chat = () => {
  const { channelId } = useParams();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [statusCode, setStatusCode] = useState<number>(0);
  const channelApi = new ChannelApi();

  const setChannel = (allChannel: Channel[]) => {
    if (allChannel.length <= 0) {
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
  };

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannels(undefined, undefined, {
        withCredentials: true,
      });
      setChannels(res.data);
      if (res.data.length <= 0) {
        return;
      }
      setChannel(res.data);
    } catch (err: any) {
      // TODO: error handling
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    setChannel(channels);
  }, [channelId]);

  return (
    <ErrorRouter statusCode={statusCode}>
      <Container component="main">
        <Stack direction="row" spacing={2} paddingX={2} paddingTop={2}>
          <ChannelList
            selectedChannel={selectedChannel}
            channels={channels}
            setChannels={setChannels}
            // それぞれhightを指定して、overflow設定する
          />
          <Divider orientation="vertical" flexItem variant="middle" />
          {selectedChannel && <MessageList channel={selectedChannel} />}
        </Stack>
      </Container>
    </ErrorRouter>
  );
};

export default Chat;
