import { CircularProgress, Grid, Stack } from '@mui/material'
import { useState, useEffect } from 'react';
import { ResponseUser, UserApi } from '../../api/generated/api';
import AccountSetting from '../model/AccountSetting'
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

  return (
    statusCode ? <div>{statusCode}</div> :
    <Grid container justifyContent='center'>
      <Stack direction='row' margin={2} spacing={2}>
        <SettingTab actions={actions} />
        { user ? <AccountSetting user={user} /> : <CircularProgress /> }
      </Stack>
    </Grid>
  )
}

export default Settings
