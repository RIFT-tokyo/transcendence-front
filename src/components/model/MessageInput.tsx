import { Send } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { ChangeEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import { EVENT } from '../config/constants';

const MessageInput = () => {
  const { channelId } = useParams();
  const { authUser } = useContext(AuthContext);
  const { client } = useContext(SocketContext);
  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const sendMessage = async () => {
    client.channels.emit(EVENT.SEND_MESSAGE, {
      text,
      userID: authUser?.id,
      channelID: channelId,
    });
    setText('');
  };

  return (
    <TextField
      sx={{ bgcolor: 'background.paper' }}
      id="text"
      placeholder="Message"
      value={text}
      onChange={handleChange}
      size="small"
      multiline
      fullWidth
      required
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={() => sendMessage()}
            aria-label="send message"
            edge="end"
            disabled={text.length === 0}
          >
            <Send />
          </IconButton>
        ),
      }}
    />
  );
};

export default MessageInput;
