import { Grid, Stack } from '@mui/material'
import AccountSetting from '../model/AccountSetting'
import SettingTab from '../ui/SettingTab'

const Settings = () => {
  const actions = ['Account', 'Security'];
  return (
    <Grid container justifyContent='center'>
      <Stack direction='row' margin={2} spacing={2}>
        <SettingTab actions={actions} />
      </Stack>
    </Grid>
  )
}

export default Settings
