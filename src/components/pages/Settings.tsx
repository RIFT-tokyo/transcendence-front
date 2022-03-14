import { Button, CircularProgress, Grid, Stack } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { User, UserApi } from '../../api/generated/api';
import { AuthContext } from '../../contexts/AuthContext';
import AccountSetting from '../model/AccountSetting';
import SecuritySetting from '../model/SecuritySetting';
import ErrorRouter from '../ui/ErrorRouter';
import Footer from '../ui/Footer';
import SettingTab from '../ui/SettingTab';

type Props = {
  active: string;
};

const Settings: React.VFC<Props> = ({ active }) => {
  const actions = ['Account', 'Security'];
  const [user, setUser] = useState<User | null>(null);
  const userApi = new UserApi();
  const [statusCode, setStatusCode] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { authUser } = useContext(AuthContext);

  useEffect(() => {
    setUser(authUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = async () => {
    setLoading(true);
    await userApi
      .getMe({ withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setStatusCode(err.response.status);
      });
    setLoading(false);
  };

  const submit = async () => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    const data = {
      username: user.username,
      display_name: user.display_name,
      status_message: user.status_message,
    };
    await userApi
      .putUsersUserId(user.id!, data, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setStatusCode(err.response.status);
      });
    setLoading(false);
  };

  let settingContent = <CircularProgress />;
  if (active === 'Account' && !loading && user) {
    settingContent = <AccountSetting user={user} setUser={setUser} />;
  } else if (active === 'Security' && !loading) {
    settingContent = <SecuritySetting />;
  }

  const getFooter = (active: string) => {
    if (active === 'Account') {
      return (
        <Footer>
          <Stack direction="row" margin={2} spacing={2}>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              onClick={reset}
            >
              reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={submit}
            >
              save
            </Button>
          </Stack>
        </Footer>
      );
    }
    return null;
  };

  return (
    <ErrorRouter statusCode={statusCode}>
      <Grid container justifyContent="center">
        <Stack direction="row" margin={2} spacing={2}>
          <SettingTab actions={actions} />
          {settingContent}
        </Stack>
      </Grid>
      {getFooter(active)}
    </ErrorRouter>
  );
};

export default Settings;
