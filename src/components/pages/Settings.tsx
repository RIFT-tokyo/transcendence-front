import { Button, CircularProgress, Grid, Stack } from '@mui/material'
import { useState, useEffect } from 'react';
import { ResponseUser, UserApi } from '../../api/generated/api';
import AccountSetting from '../model/AccountSetting'
import SecuritySetting from '../model/SecuritySetting';
import ErrorRouter from '../ui/ErrorRouter';
import Footer from '../ui/Footer';
import SettingTab from '../ui/SettingTab'

type Props = {
  active: string
}

const Settings: React.VFC<Props> = ({ active }) => {
  const actions = ['Account', 'Security'];
  const [user, setUser] = useState<ResponseUser | null>(null);
  const userApi = new UserApi();
  const [statusCode, setStatusCode] = useState<number>(0);

  useEffect(() => {
    (async () => {
      await userApi.getMe().then((res) => {
        setUser(res.data);
      }).catch((err) => {
        setStatusCode(err.response.status);
      });
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reset = async () => {
    await userApi.getMe().then((res) => {
      setUser(res.data);
    }).catch((err) => {
      setStatusCode(err.response.status);
    });
  }

  const submit = async () => {
    if (!user) {
      return;
    }
    const data = {
      ...user,
      profile_image: undefined
    }
    await userApi.putUsersUserId(user.id, data).then((res) => {
      setUser(res.data);
    }).catch((err) => {
      setStatusCode(err.response.status);
    });
  }

  let settingContent = <CircularProgress />;
  if (active === 'Account' && user) {
    settingContent = <AccountSetting user={user} setUser={setUser} />;
  } else if (active === 'Security' && user) {
    settingContent = <SecuritySetting/>;
  }

  const getFooter = (active: string) => {
    if (active === 'Account') {
      return (
        <Footer>
          <Stack direction='row' margin={2} spacing={2}>
            <Button variant='contained' color='inherit' size='large' onClick={reset}>reset</Button>
            <Button variant='contained' color='primary' size='large' onClick={submit}>save</Button>
          </Stack>
        </Footer>
      )
    }
    return null
  }

  return (
    <ErrorRouter statusCode={statusCode}>
      <Grid container justifyContent='center'>
        <Stack direction='row' margin={2} spacing={2}>
          <SettingTab actions={actions} />
          {settingContent}
        </Stack>
      </Grid>
      {getFooter(active)}
    </ErrorRouter>
  )
}

export default Settings
