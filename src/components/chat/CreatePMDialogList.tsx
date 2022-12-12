import AddIcon from '@mui/icons-material/Add';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';
import { User } from '../../api/generated';

type Props = {
  users: User[];
  selectedUser: User | null;
  handleClick: (user: User) => void;
};

const CreatePMDialogList = (props: Props) => {
  const { users, selectedUser, handleClick } = props;

  if (users.length === 0) {
    return (
      <>
        <Typography>There are no users to pm.</Typography>
        <Typography sx={{ display: 'inline' }}>
          Create a user from the{' '}
        </Typography>
        <AddIcon sx={{ fontSize: 14 }} />
        <Typography sx={{ display: 'inline' }}> button.</Typography>
      </>
    );
  }

  return (
    <List
      sx={[
        {
          maxHeight: 330,
          overflowY: 'auto',
          pt: 0,
        },
        (theme) => ({
          '&& .Mui-selected, && .Mui-selected:hover': {
            backgroundColor: theme.palette.selected.main,
          },
        }),
      ]}
    >
      {users.map((user) => (
        <Fragment key={`user-list-${user.id}`}>
          <ListItem disablePadding>
            <ListItemButton
              selected={user.id === selectedUser?.id}
              onClick={() => handleClick(user)}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                width="100%"
              >
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                  {user.username}
                </Typography>
              </Stack>
            </ListItemButton>
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

export default CreatePMDialogList;
