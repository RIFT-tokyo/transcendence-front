import { Collapse, IconButton, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useReducer } from 'react';
import { User } from '../../api/generated';
import PMListItem from './PMListItem';
import CreatePMDialog from './CreatePMDialog';

type Props = {
  selectedUser: User | null;
  pmUsers: User[];
  addUser: (user: User) => void;
};

type State = {
  openAddUserDialog: boolean;
  openUsers: boolean;
};

type Actions =
  | { type: 'OPEN_CREATE_PM_DIALOG' }
  | { type: 'OPEN_USER_LIST' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'OPEN_CREATE_PM_DIALOG':
      return {
        ...state,
        openAddUserDialog: !state.openAddUserDialog,
      };
    case 'OPEN_USER_LIST':
      return { ...state, openUsers: !state.openUsers };
    default:
      return state;
  }
};

const PMList = (props: Props) => {
  const { selectedUser, pmUsers, addUser } = props;

  const [state, dispatch] = useReducer(reducer, {
    openAddUserDialog: false,
    openUsers: true,
  });

  return (
    <Stack direction="column" spacing={0.5} width={230} flexShrink={0}>
      <Stack direction="row" alignItems="center">
        <IconButton
          aria-label="Toggle pm user visibility"
          onClick={() => dispatch({ type: 'OPEN_USER_LIST' })}
        >
          {state.openUsers ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
        <Typography
          sx={{ fontWeight: 'bold', flexGrow: 1, cursor: 'pointer' }}
          variant="h5"
          onClick={() => dispatch({ type: 'OPEN_USER_LIST' })}
        >
          Private Message
        </Typography>
        <IconButton
          aria-label="create pm user"
          onClick={() => dispatch({ type: 'OPEN_CREATE_PM_DIALOG' })}
        >
          <AddIcon />
        </IconButton>
        <CreatePMDialog
          open={state.openAddUserDialog}
          setOpen={() => dispatch({ type: 'OPEN_CREATE_PM_DIALOG' })}
          joinedPMUsers={pmUsers}
          addPMUser={addUser}
        />
      </Stack>
      <Collapse in={state.openUsers}>
        <Stack pl={4} spacing={0.5}>
          {pmUsers.map((user) => (
            <PMListItem
              key={user.id}
              pmUser={user}
              selected={user.id === selectedUser?.id}
            />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default PMList;
