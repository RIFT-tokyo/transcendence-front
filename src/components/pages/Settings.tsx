import { Grid, Stack } from '@mui/material'
import AccountSetting from '../model/AccountSetting'
import SettingTab from '../ui/SettingTab'

const Settings = () => {
  return (
    <Grid container justifyContent='center'>
      <Stack direction='row' margin={2} spacing={2}>
        <SettingTab />
        <AccountSetting />
      </Stack>
    </Grid>
  )
}

export default Settings
