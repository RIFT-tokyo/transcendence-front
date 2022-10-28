import { Send } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { ChangeEvent, KeyboardEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import useMessage from '../../api/websocket/useMessage';
import { AuthContext } from '../../contexts/AuthContext';

const MessageInput = () => {
  const { channelId, toUserId } = useParams();
  const { authUser } = useContext(AuthContext);
  const { sendMessage, sendPrivateMessage } = useMessage();
  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleClick = async () => {
    if (channelId) {
      sendMessage(text, authUser!.id!, Number(channelId));
    } else {
      sendPrivateMessage(text, authUser!.id!, Number(toUserId));
    }
    setText('');
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;

    e.preventDefault();

    if (channelId) {
      sendMessage(text, authUser!.id!, Number(channelId));
    } else {
      sendPrivateMessage(text, authUser!.id!, Number(toUserId));
    }
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
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <IconButton
            onClick={handleClick}
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
