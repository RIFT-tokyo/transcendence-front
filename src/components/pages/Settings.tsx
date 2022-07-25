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
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_STATUS_CODE'; payload: number }
  | { type: 'LOADING' };

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_STATUS_CODE':
      return { ...state, statusCode: action.payload };
    case 'LOADING':
      return { ...state, isLoading: !state.isLoading };
    default:
      return state;
  }
};

const actions = ['Account', 'Security'];

const userApi = new UserApi();

const Settings: React.VFC<Props> = ({ active }: Props) => {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(reducer, {
    user: authUser,
    statusCode: 0,
    isLoading: false,
  });

  const reset = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const { data } = await userApi.getMe({ withCredentials: true });
      dispatch({ type: 'SET_USER', payload: data });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        dispatch({ type: 'SET_STATUS_CODE', payload: err.response.status });
      }
    }
    dispatch({ type: 'LOADING' });
  };

  const submit = async () => {
    if (!state.user?.id) {
      return;
    }
    dispatch({ type: 'LOADING' });
    const requestBody = {
      username: state.user.username,
      display_name: state.user.display_name,
      status_message: state.user.status_message,
    };
    try {
      const { data } = await userApi.putUsersUserId(
        state.user.id,
        requestBody,
        {
          withCredentials: true,
        },
      );
      enqueueSnackbar('Profile updated', { variant: 'success' });
      dispatch({ type: 'SET_USER', payload: data });
    } catch (err: unknown) {
      if (Axios.isAxiosError(err) && err.response) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      }
    }
    dispatch({ type: 'LOADING' });
  };

  const setUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    setAuthUser(user);
  };

  let settingContent = <CircularProgress />;
  if (active === 'Account' && !state.isLoading && state.user) {
    settingContent = (
      <AccountSetting
        user={state.user}
        setUser={setUser}
        submit={submit}
        reset={reset}
      />
    );
  } else if (active === 'Security' && !state.isLoading && state.user) {
    settingContent = <SecuritySetting user={state.user} setUser={setUser} />;
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
