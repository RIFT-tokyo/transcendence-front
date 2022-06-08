import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Collapse,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import { ChangeEvent, Dispatch, MouseEvent } from 'react';
import { Actions, State } from './types/reducer';

type Props = {
  state: State;
  dispatch: Dispatch<Actions>;
};

const CreateChannelPanel = (props: Props) => {
  const { state, dispatch } = props;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_NAME', payload: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_PASSWORD', payload: e.target.value });
  };

  const handleIsPrivateChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_IS_PRIVATE', payload: e.target.checked });
  };

  const handleVisibilityChange = (e: MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: 'TOGGLE_SHOW_PASSWORD' });
  };

  return (
    <>
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
        control={
          <Switch checked={state.isPrivate} onChange={handleIsPrivateChange} />
        }
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
    </>
  );
};

export default CreateChannelPanel;
