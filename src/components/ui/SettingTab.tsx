import { Stack, Typography } from '@mui/material'

const SettingTab = () => {
  return (
    <Stack width={180} direction='column' spacing={1}>
      <Typography variant='h5'>Account</Typography>
      <Typography variant='h5'>Security</Typography>
    </Stack>
  )
}

export default SettingTab