import { Stack, Typography, Divider, TextField, Button } from '@mui/material'

const SecuritySetting = () => {
  return (
    <Stack bgcolor='background.paper' width={500}>
      <Stack padding={2} direction='column' spacing={1}>
        <Typography variant='h4'>Security</Typography>
        <Divider />
        <Typography variant='h5'>Change password</Typography>
        <Typography variant='h6'>Current password</Typography>
        <TextField size='small' variant='outlined' value='current password' />
        <Typography variant='h6'>New password</Typography>
        <TextField size='small' variant='outlined' value='new password' />
        <Typography variant='h6'>Confirm password</Typography>
        <TextField size='small' variant='outlined' value='confirm password' />
        <Button variant='contained' color='primary'>update password</Button>
        <Divider />
        <Typography variant='h5'>Two-factor authentication</Typography>
        <Typography variant='body1'>Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.</Typography>
        <Button variant='contained' color='primary'>activate</Button>
      </Stack>
    </Stack>
  )
}

export default SecuritySetting