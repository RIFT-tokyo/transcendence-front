import { TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';

const MessageInput = () => {
  const [text, setText] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <TextField
      sx={{ bgcolor: 'background.paper' }}
      id="text"
      placeholder="Message"
      value={text}
      onChange={handleChange}
      multiline
      fullWidth
      required
    />
  );
};

export default MessageInput;
