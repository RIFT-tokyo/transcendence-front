import { Send } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import { ChangeEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import useMessage from '../../api/websocket/useMessage';
import { AuthContext } from '../../contexts/AuthContext';

const MessageInput = () => {
  const { channelId } = useParams();
  const { authUser } = useContext(AuthContext);
  const { sendMessage } = useMessage();
  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleClick = async () => {
    sendMessage(text, authUser!.id!, Number(channelId));
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
            onClick={() => handleClick()}
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
