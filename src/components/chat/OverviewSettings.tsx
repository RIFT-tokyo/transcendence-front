import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Collapse,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction, useReducer } from 'react';
import { Channel } from '../../api/generated';

type Props = {
  channel: Channel;
  updateChannel: (name: string, password: string | null) => void;
};

type State = {
  name: string;
  password: string;
  showPassword: boolean;
  errorName: boolean;
  errorPassword: boolean;
  isPrivate: boolean;
  isRequesting: boolean;
};

type Actions =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_SHOW_PASSWORD' }
  | { type: 'SET_ERROR_NAME'; payload: boolean }
  | { type: 'SET_ERROR_PASSWORD'; payload: boolean }
  | { type: 'SET_IS_PRIVATE'; payload: boolean }
  | { type: 'SET_IS_REQUESTING'; payload: boolean }
  | { type: 'CLOSE_DIALOG' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_ERROR_NAME':
      return { ...state, errorName: action.payload };
    case 'SET_ERROR_PASSWORD':
      return { ...state, errorPassword: action.payload };
    case 'SET_IS_PRIVATE':
      return { ...state, isPrivate: action.payload };
    case 'SET_IS_REQUESTING':
      return { ...state, isRequesting: action.payload };
    case 'CLOSE_DIALOG':
      return {
        ...state,
        name: '',
        password: '',
        errorName: false,
        errorPassword: false,
      };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const exhaustivenessCheck: never = action;
      return state;
    }
  }
};

const OverviewSettings = (props: Props) => {
  const { channel, updateChannel } = props;
  const [state, dispatch] = useReducer(reducer, {
    name: channel.name ?? '',
    password: '',
    showPassword: false,
    errorName: false,
    errorPassword: false,
    isPrivate: channel.is_protected ?? false,
    isRequesting: false,
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NAME', payload: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
  };

  const handleIsPrivateChange = () => {
    dispatch({ type: 'SET_IS_PRIVATE', payload: !state.isPrivate });
  };

  const handleVisibilityChange = () => {
    dispatch({ type: 'TOGGLE_SHOW_PASSWORD' });
  };

  return (
    <Box component="form">
      <TextField
        required
        autoFocus
        fullWidth
        margin="dense"
        id="name"
        label="Channel Name"
        value={state.name}
        disabled={state.isRequesting}
        onChange={handleNameChange}
        error={state.errorName}
        helperText={
          state.errorName ? 'Please fill Channel Name field' : undefined
        }
      />
      <FormControlLabel
        sx={{ display: 'flex', justifyContent: 'space-between' }}
        onClick={handleIsPrivateChange}
        control={<Switch checked={state.isPrivate} />}
        label="Private Channel"
        labelPlacement="start"
      />
      <Collapse in={state.isPrivate}>
        <TextField
          fullWidth
          margin="dense"
          id="password"
          label="Channel Password"
          type={state.showPassword ? 'text' : 'password'}
          value={state.password}
          disabled={state.isRequesting || !state.isPrivate}
          onChange={handlePasswordChange}
          error={state.errorPassword}
          helperText={
            state.errorPassword
              ? 'Please fill Channel Password field'
              : undefined
          }
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleVisibilityChange}
                edge="end"
              >
                {state.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </Collapse>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="medium"
        onClick={() => {updateChannel(state.name, state.password)}}
      >
        Update Channel
      </Button>
    </Box>
  );
};

export default OverviewSettings;
