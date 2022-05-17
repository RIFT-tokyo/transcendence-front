import { CircularProgress, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useContext, useReducer } from 'react';
import Axios from 'axios';
import { User, UserApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import AccountSetting from '../model/AccountSetting';
import SecuritySetting from '../model/SecuritySetting';
import ErrorRouter from '../ui/ErrorRouter';
import SettingTab from '../ui/SettingTab';

type Props = {
  active: string;
};

type State = {
  user: User | null;
  statusCode: number;
  isLoading: boolean;
};

type Actions =
  | { type: 'user'; user: User }
  | { type: 'statusCode'; statusCode: number }
  | { type: 'loading' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'user':
      return { ...state, user: action.user };
    case 'statusCode':
      return { ...state, statusCode: action.statusCode };
    case 'loading':
      return { ...state, isLoading: !state.isLoading };
    default:
      return state;
  }
};

const actions = ['Account', 'Security'];

const userApi = new UserApi();

const Settings: React.VFC<Props> = ({ active }: Props) => {
  const { authUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, {
    user: authUser,
    statusCode: 0,
    isLoading: false,
  });

  const reset = async () => {
    dispatch({ type: 'loading' });
    try {
      const { data } = await userApi.getMe({ withCredentials: true });
      dispatch({ type: 'user', user: data });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'statusCode', statusCode: err.response.status });
      }
    }
    dispatch({ type: 'loading' });
  };

  const submit = async () => {
    if (!state.user?.id) {
      return;
    }
    dispatch({ type: 'loading' });
    const requestBody = {
      username: state.user.username,
      display_name: state.user.display_name,
      status_message: state.user.status_message,
    };
    try {
      const { data } = await userApi.putUsersUserId(state.user.id, requestBody, {
        withCredentials: true,
      });
      enqueueSnackbar('Profile updated', { variant: 'success' });
      dispatch({ type: 'user', user: data });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'loading' });
  };

  let settingContent = <CircularProgress />;
  if (active === 'Account' && !state.isLoading && state.user) {
    settingContent = (
      <AccountSetting
        user={state.user}
        setUser={(user: User) => dispatch({ type: 'user', user })}
        submit={submit}
        reset={reset}
      />
    );
  } else if (active === 'Security' && !state.isLoading) {
    settingContent = <SecuritySetting />;
  }

  return (
    <ErrorRouter statusCode={state.statusCode}>
      <Grid container justifyContent="center">
        <Stack direction="row" margin={2} spacing={2}>
          <SettingTab actions={actions} />
          {settingContent}
        </Stack>
      </Grid>
    </ErrorRouter>
  );
};

export default Settings;
