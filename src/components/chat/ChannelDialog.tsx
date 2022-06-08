import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import LockIcon from '@mui/icons-material/Lock';
import { useSnackbar } from 'notistack';
import Axios from 'axios';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Channel, ChannelApi, NewChannel } from '../../api/generated';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  addChannel: (channel: Channel) => void;
};

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`channel-dialog-tabpanel-${index}`}
      aria-labelledby={`channel-dialog-tab-${index}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {value === index && (
        <Box component="div" pt={3} pl={3} pr={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ChannelDialog = (props: Props) => {
  const { open, setOpen, addChannel } = props;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [channels, setChannels] = useState<Channel[]>([]);
  const channelApi = new ChannelApi();
  const { enqueueSnackbar } = useSnackbar();

  const fetchChannels = async () => {
    try {
      const res = await channelApi.getChannels({ withCredentials: true });
      setChannels(res.data);
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response?.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      } else if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const closeDialog = () => {
    setName('');
    setPassword('');
    setErrorName(false);
    setErrorPassword(false);
    setOpen(false);
  };

  const isValidName = (channelName: string): boolean => !!channelName;
  const isValidPassword = (channelPassword: string): boolean =>
    !isPrivate || !!channelPassword;

  const validateFields = (
    channelName: string,
    channelPassword: string,
  ): boolean => {
    setErrorName(!isValidName(channelName));
    setErrorPassword(!isValidPassword(channelPassword));
    return isValidName(channelName) && isValidPassword(channelPassword);
  };

  const createChannel = async (
    channelName: string,
    channelPassword: string,
  ) => {
    if (!validateFields(channelName, channelPassword)) {
      return;
    }
    const newChannel: NewChannel = { name: channelName };
    if (isPrivate && password) {
      newChannel.password = channelPassword;
    }
    try {
      setIsRequesting(true);
      const res = await channelApi.postChannels(newChannel, {
        withCredentials: true,
      });
      addChannel(res.data);
      closeDialog();
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response?.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      } else if (err instanceof Error) {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
    setIsRequesting(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleIsPrivateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPrivate(e.target.checked);
  };

  const handleTabIndexChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const channelIcon = (isProtected: boolean) => {
    if (isProtected) {
      return <LockIcon />;
    }
    return <TagIcon />;
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
      <DialogContent sx={{ height: 420 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabIndexChange}
          aria-label="channdl dialog tabs"
        >
          <Tab
            label="Subscribe Channel"
            id="channel-dialog-0"
            aria-controls="channel-dialog-tabpanel-0"
          />
          <Tab
            label="Create Channel"
            id="channel-dialog-1"
            aria-controls="channel-dialog-tabpanel-1"
          />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <List sx={{ height: 330, overflowY: 'auto', pt: 0 }}>
            {channels.map((channel) => (
              <>
                <ListItem disablePadding key={`list-${channel.id}`}>
                  <ListItemButton>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {channelIcon(channel.is_protected ?? false)}
                      <Typography variant="h6" noWrap>
                        {channel.name}
                      </Typography>
                    </Stack>
                  </ListItemButton>
                </ListItem>
                <Divider key={`divider-${channel.id}`} />
              </>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <TextField
            required
            autoFocus
            fullWidth
            margin="dense"
            id="name"
            label="Channel Name"
            value={name}
            disabled={isRequesting}
            onChange={handleNameChange}
            error={errorName}
            helperText={
              errorName ? 'Please fill Channel Name field' : undefined
            }
          />
          <FormControlLabel
            sx={{ display: 'flex', justifyContent: 'space-between' }}
            control={
              <Switch checked={isPrivate} onChange={handleIsPrivateChange} />
            }
            label="Private Channel"
            labelPlacement="start"
          />
          <Collapse in={isPrivate}>
            <TextField
              fullWidth
              margin="dense"
              id="password"
              label="Channel Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              disabled={isRequesting || !isPrivate}
              onChange={handlePasswordChange}
              error={errorPassword}
              helperText={
                errorPassword ? 'Please fill Channel Password field' : undefined
              }
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Collapse>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Cancel</Button>
        {tabIndex === 1 && (
          <Button
            onClick={() => createChannel(name, password)}
            disabled={isRequesting}
          >
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChannelDialog;
