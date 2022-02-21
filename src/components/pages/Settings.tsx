import { Button, CircularProgress, Grid, Stack } from '@mui/material'
import { useState, useEffect } from 'react';
import { ResponseUser, UserApi } from '../../api/generated/api';
import AccountSetting from '../model/AccountSetting'
import Footer from '../ui/Footer';
import SettingTab from '../ui/SettingTab'

const Settings = () => {
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
    await userApi.putUsersUserId(user.id, user).then((res) => {
      setUser(res.data);
    }).catch((err) => {
      setStatusCode(err.response.status);
    });
  }

  return (
    statusCode ? <div>{statusCode}</div> :
    <>
      <Grid container justifyContent='center'>
        <Stack direction='row' margin={2} spacing={2}>
          <SettingTab actions={actions} />
          { user ? <AccountSetting user={user} setUser={setUser} /> : <CircularProgress /> }
        </Stack>
      </Grid>
      <Footer>
        <Stack direction='row' margin={2} spacing={2}>
          <Button variant='contained' color='inherit' size='large' onClick={reset}>reset</Button>
          <Button variant='contained' color='primary' size='large' onClick={submit}>save</Button>
        </Stack>
      </Footer>
    </>
  )
}

export default Settings
