import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Dispatch, MouseEvent, SetStateAction, useReducer } from 'react';
import { Channel } from '../../api/generated';
import ModerationSettings from './ModerationSettings';
import OverviewSettings from './OverviewSettings';
import RolesSettings from './RolesSettings';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  channel: Channel;
};

type State = {
  selectedIndex: number;
};

type Actions = { type: 'SET_SELECTED_INDEX'; payload: number };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_SELECTED_INDEX':
      return { ...state, selectedIndex: action.payload };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return state;
    }
  }
};

const listItems = [
  {
    name: 'Overview',
    component: (channel: Channel) => <OverviewSettings channel={channel} />,
  },
  {
    name: 'Moderation',
    component: (channel: Channel) => <ModerationSettings channel={channel} />,
  },
  { name: 'Roles', component: () => <RolesSettings /> },
];

const ChannelSettingsDialog = (props: Props) => {
  const { open, setOpen, channel } = props;
  const [state, dispatch] = useReducer(reducer, {
    selectedIndex: 0,
  });

  const closeDialog = () => {
    setOpen(false);
  };

  const handleListItemClick = (
    event: MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    dispatch({ type: 'SET_SELECTED_INDEX', payload: index });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          <List
            sx={[
              (theme) => ({
                '&& .Mui-selected, && .Mui-selected:hover': {
                  backgroundColor: theme.palette.selected.main,
                },
              }),
            ]}
          >
            {listItems.map((item, index) => (
              <ListItemButton
                key={`listItem-${item.name}`}
                selected={state.selectedIndex === index}
                onClick={(event) => handleListItemClick(event, index)}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>
          <Divider orientation="vertical" flexItem variant="middle" />
          <Box component="div" width={400}>
            <Typography variant="h6" pb={2}>
              {listItems[state.selectedIndex].name}
            </Typography>
            {listItems[state.selectedIndex].component(channel)}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => closeDialog()}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChannelSettingsDialog;
