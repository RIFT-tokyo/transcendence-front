import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ChannelSettingsDialog = (props: Props) => {
  const { open, setOpen } = props;

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Channel settings</DialogTitle>
      <DialogContent>
        <TextField label="Channel Name" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChannelSettingsDialog;
